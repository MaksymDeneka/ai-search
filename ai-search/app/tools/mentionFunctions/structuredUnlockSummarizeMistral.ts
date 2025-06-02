'use server';

import { HfInference } from '@huggingface/inference';
import { z } from 'zod';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const UrlExtraction = z.object({
  url: z.string(),
});

export async function WebScraperMistral(mentionTool: string, userMessage: string, streamable: any) {
  let targetUrl: string;

  try {
    streamable.update({ llmResponse: `Analyzing your query to find the relevant website...\n\n` });

    const mappedUrl = checkCommonSiteMappings(userMessage);

    let extractedUrl: string | null = null;

    if (mappedUrl) {
      extractedUrl = mappedUrl;
      console.log('URL found via mapping:', extractedUrl);
    } else {
      const rawExtractedUrl = await extractUrlFromQuery(userMessage);

      if (rawExtractedUrl) {
        extractedUrl = cleanAndValidateUrl(rawExtractedUrl);
        console.log('URL found via LLM and cleaned:', extractedUrl);
      }
    }

    if (!extractedUrl) {
      streamable.update({ llmResponse: `No valid URL found in the user message \n\n` });
      throw new Error('No valid URL found in the user message');
    }

    streamable.update({
      llmResponse: `Extracting information from: [${extractedUrl}](${extractedUrl}) \n\n`,
    });
    targetUrl = extractedUrl;
    const connUrl = process.env.API_URL;
    const apiUrl = `http://${connUrl}:3001/api/scrape`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: targetUrl, query: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    if (!responseData.content) {
      throw new Error('No content received from the server');
    }

    let contentForLLM = responseData.content;

    await summarizeWithMistral(contentForLLM, userMessage, streamable);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    try {
      let userFriendlyMessage = `Sorry, I was unable to get information from the website. `;
      if (errorMessage.includes('No content received')) {
        userFriendlyMessage +=
          'The website data could not be processed correctly. This might be due to changes in the website structure or temporary issues.';
      } else {
        userFriendlyMessage += errorMessage;
      }
      streamable.update({ llmResponse: userFriendlyMessage });
      streamable.done({ llmResponseEnd: true });
    } catch (streamError) {
      console.error('Error updating stream:', streamError);
    }
  }
}

function checkCommonSiteMappings(query: string): string | null {
  const lowerQuery = query.toLowerCase();

  const siteMappings: Record<string, string> = {
    'hacker news': 'https://news.ycombinator.com/',
    hn: 'https://news.ycombinator.com/',
    'y combinator': 'https://news.ycombinator.com/',
    reddit: 'https://www.reddit.com/',
    twitter: 'https://twitter.com/',
    'x.com': 'https://twitter.com/',
    x: 'https://twitter.com/',
    github: 'https://github.com/',
    stackoverflow: 'https://stackoverflow.com/',
    'stack overflow': 'https://stackoverflow.com/',
    youtube: 'https://www.youtube.com/',
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    nytimes: 'https://www.nytimes.com/',
    'new york times': 'https://www.nytimes.com/',
    bbc: 'https://www.bbc.com/',
    cnn: 'https://www.cnn.com/',
    wikipedia: 'https://en.wikipedia.org/',
    amazon: 'https://www.amazon.com/',
    ebay: 'https://www.ebay.com/',
    linkedin: 'https://www.linkedin.com/',
    netflix: 'https://www.netflix.com/',
  };

  for (const [keyword, url] of Object.entries(siteMappings)) {
    if (lowerQuery.includes(keyword)) {
      return url;
    }
  }

  return null;
}

async function extractUrlFromQuery(query: string) {
  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      inputs: `<s>You are an expert at extracting the most likely valid URL from user queries. 
              When users mention websites by name but don't provide the exact URL, you know the 
              correct URL to use.
              
              For example:
              - "What are the top 5 stories on hacker news right now?" → https://news.ycombinator.com/
              - "Tell me about the latest tech news on Reddit" → https://www.reddit.com/r/technology/
              - "What's trending on Twitter?" → https://twitter.com/
              
              Return ONLY the URL, nothing else. Do not include any quotes, tags, or additional text.</s>
              
              <user>${query}</user>`,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.1,
        return_full_text: false,
      },
    });

    let extractedText = response.generated_text.trim();

    extractedText = extractedText
      .replace(/['"`]/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/[\n\r]/g, '')
      .trim();

    const urlRegex = /(https?:\/\/[^\s<>]+)/g;
    const matches = extractedText.match(urlRegex);

    if (matches && matches.length > 0) {
      return matches[0].replace(/[,.;:!?)]+$/, '');
    }

    const domainRegex = /([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/;
    const domainMatches = extractedText.match(domainRegex);

    if (domainMatches && domainMatches.length > 0) {
      return `https://${domainMatches[0]}`;
    }

    if (extractedText.startsWith('www.')) {
      return `https://${extractedText}`;
    }

    console.log('Raw LLM response for URL extraction:', extractedText);
    return extractedText;
  } catch (error) {
    console.error('Error extracting URL:', error);
    return null;
  }
}

function cleanAndValidateUrl(url: string): string | null {
  try {
    if (!url) return null;

    let cleanUrl = url
      .trim()
      .replace(/^['"`<(\s]+|['"`>)\s]+$/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '');

    const tagIndex = cleanUrl.indexOf('</');
    if (tagIndex !== -1) {
      cleanUrl = cleanUrl.substring(0, tagIndex);
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch (e) {
      console.warn('Invalid URL format:', cleanUrl);
      return null;
    }
  } catch (error) {
    console.error('Error cleaning URL:', error);
    return null;
  }
}

async function summarizeWithMistral(content: string, query: string, streamable: any) {
  try {
    const prompt = `<s>Always respond in valid markdown format to the user query based on the context provided</s>
                  <user>Here is the context: <context>${content}</context>
                  Response to the user query: ${query}</user>`;

    const stream = await hf.textGenerationStream({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    for await (const chunk of stream) {
      if (chunk.token.text) {
        streamable.update({ llmResponse: chunk.token.text });
      }
    }

    streamable.done({ llmResponseEnd: true });
  } catch (error) {
    console.error('Streaming error:', error);

    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        inputs: `<s>Always respond in valid markdown format to the user query based on the context provided</s>
                <user>Here is the context: <context>${content}</context>
                Response to the user query: ${query}</user>`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      streamable.update({ llmResponse: response.generated_text });
      streamable.done({ llmResponseEnd: true });
    } catch (fallbackError) {
      const errorMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
      streamable.update({
        llmResponse: `Sorry, I was unable to summarize the content: ${errorMessage}`,
      });
      streamable.done({ llmResponseEnd: true });
    }
  }
}
