'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

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

async function extractUrlFromQueryWithGemini(query: string): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', safetySettings });
    const prompt = `
      You are an expert at extracting the most likely valid URL from user queries.
      When users mention websites by name, even if they don't provide the exact URL, identify and return the correct base URL.
      Return ONLY the URL, and nothing else. Do not include any quotes, tags, markdown, or additional text.
      Ensure the URL starts with http:// or https://.

      Examples:
      - User query: "What are the top 5 stories on hacker news right now?" -> Expected URL: https://news.ycombinator.com
      - User query: "Tell me about the latest tech news on Reddit" -> Expected URL: https://www.reddit.com
      - User query: "What's trending on Twitter?" -> Expected URL: https://twitter.com
      - User query: "Find information on google.com" -> Expected URL: https://google.com
      - User query: "latest updates from bbc news" -> Expected URL: https://www.bbc.com/news

      User query: "${query}" -> Expected URL:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const extractedText = response.text().trim();

    console.log('Raw Gemini response for URL extraction:', extractedText);

    if (
      extractedText &&
      (extractedText.startsWith('http://') || extractedText.startsWith('https://'))
    ) {
      let cleanUrl = extractedText.replace(/[,.;:!?)]+$/, '');
      try {
        new URL(cleanUrl);
        return cleanUrl;
      } catch (e) {
        console.warn('Gemini extracted an invalid URL format:', cleanUrl, e);
        return null;
      }
    } else if (extractedText) {
      const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (domainRegex.test(extractedText)) {
        const assumedUrl = `https://${extractedText}`;
        try {
          new URL(assumedUrl);
          return assumedUrl;
        } catch (e) {
          console.warn('Gemini extracted a domain, but it formed an invalid URL:', assumedUrl, e);
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting URL with Gemini:', error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'promptFeedback' in error.response
    ) {
      console.error('Prompt Feedback:', error.response.promptFeedback);
    }
    return null;
  }
}

function validateAndCleanUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    let cleanUrl = url.trim().replace(/<\/?[^>]+(>|$)/g, '');

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      if (cleanUrl.includes('.') && !cleanUrl.includes(' ')) {
        cleanUrl = `https://${cleanUrl}`;
      } else {
        console.warn('URL does not look like a valid domain or is missing scheme:', cleanUrl);
        return null;
      }
    }
    new URL(cleanUrl);
    return cleanUrl;
  } catch (e) {
    console.warn('Invalid URL format after validation:', url, e);
    return null;
  }
}

async function summarizeWithGemini(content: string, query: string, streamable: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', safetySettings });
    const prompt = `
      You are a helpful assistant. Based on the provided context below, please answer the user's query.
      Respond in clear, concise language and use Markdown format for your response.
      If the context does not contain information relevant to the query, state that you couldn't find the information in the provided text.

      Context:
      ---
      ${content}
      ---

      User Query: "${query}"

      Answer:
    `;

    const generationConfig = {
      maxOutputTokens: 1500,
      temperature: 0.7,
      topP: 1,
      topK: 1,
    };

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    streamable.update({ llmResponse: '' });
    let accumulatedResponse = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        accumulatedResponse += chunkText;
        streamable.update({ llmResponse: chunkText });
      }
    }

    streamable.done({ llmResponseEnd: true, fullResponse: accumulatedResponse });
  } catch (error) {
    console.error('Error summarizing with Gemini:', error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'promptFeedback' in error.response
    ) {
      console.error('Prompt Feedback:', error.response.promptFeedback);
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error during summarization.';
    streamable.update({
      llmResponse: `Sorry, I was unable to summarize the content: ${errorMessage}`,
    });
    streamable.done({ llmResponseEnd: true });
  }
}

export async function WebScraperGemini(mentionTool: string, userMessage: string, streamable: any) {
  let targetUrl: string | null = null;
  try {
    streamable.update({ llmResponse: `Analyzing your query to find the relevant website...\n\n` });

    const mappedUrl = checkCommonSiteMappings(userMessage);
    let extractedUrl: string | null = null;

    if (mappedUrl) {
      extractedUrl = mappedUrl;
      console.log('URL found via mapping:', extractedUrl);
    } else {
      const geminiExtractedUrl = await extractUrlFromQueryWithGemini(userMessage);
      if (geminiExtractedUrl) {
        extractedUrl = validateAndCleanUrl(geminiExtractedUrl);
        console.log('URL found via Gemini and validated:', extractedUrl);
      }
    }

    if (!extractedUrl) {
      streamable.update({
        llmResponse: `No valid URL found in your message. Please provide a specific website name or URL.\n\n`,
      });
      streamable.done({ llmResponseEnd: true });
      return;
    }

    targetUrl = extractedUrl;

    streamable.update({
      llmResponse: `Attempting to fetch information from: [${targetUrl}](${targetUrl})\n\n`,
    });
    const connUrl = process.env.API_URL;
    const apiUrl = `http://${connUrl}/api/scrape`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl, query: userMessage }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Bright Data API error response:', errorData);
      throw new Error(
        `Failed to fetch content from the website (status: ${response.status}). The site might be inaccessible or blocking requests.`,
      );
    }

    const responseData = await response.json();

    if (!responseData.content || responseData.content.trim() === '') {
      streamable.update({
        llmResponse: `The website provided content, but it appears to be empty or could not be processed correctly. [${targetUrl}](${targetUrl})\n\n`,
      });
      streamable.done({ llmResponseEnd: true });
      return;
    }

    let contentForLLM = responseData.content;

    streamable.update({ llmResponse: `Content fetched successfully. Summarizing...\n\n` });
    await summarizeWithGemini(contentForLLM, userMessage, streamable);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('WebScraperGemini Main Error:', error);
    try {
      let userFriendlyMessage = `Sorry, I encountered an issue. `;
      if (errorMessage.includes('Failed to fetch content')) {
        userFriendlyMessage += `I couldn't retrieve information from ${targetUrl ? `[${targetUrl}](${targetUrl})` : 'the website'}. Please check the URL or try a different one.`;
      } else if (errorMessage.includes('No valid URL found')) {
        userFriendlyMessage = `I couldn't identify a valid website URL in your request. Please specify a website.`;
      } else {
        userFriendlyMessage += `Details: ${errorMessage}`;
      }
      streamable.update({ llmResponse: userFriendlyMessage });
      streamable.done({ llmResponseEnd: true });
    } catch (streamError) {
      console.error('Error updating stream during error handling:', streamError);
    }
  }
}
