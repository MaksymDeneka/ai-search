// const express = require('express');
// const requestPromise = require('request-promise');
// const TurndownService = require('turndown');
// const puppeteer = require('puppeteer-core');

// const router = express.Router();


// const turndownService = new TurndownService({
//   headingStyle: 'atx',
//   hr: '---',
//   bulletListMarker: '-',
//   codeBlockStyle: 'fenced',
//   emDelimiter: '_',
// });

// turndownService.remove(['script', 'style', 'iframe', 'noscript']);

// function htmlToMarkdown(html) {
//   try {
//     const maxLength = 500000;
//     if (typeof html === 'string' && html.length > maxLength) {
//       console.warn(`HTML content truncated from ${html.length} to ${maxLength} characters`);
//       html = html.slice(0, maxLength) + '... (content truncated)';
//     }

//     console.log('Converting HTML to Markdown');
//     const markdown = turndownService.turndown(html);
//     console.log('Conversion complete');
//     return markdown;
//   } catch (error) {
//     console.error('Error converting HTML to markdown:', error);
//     return '[Error: Unable to convert HTML to Markdown]';
//   }
// }

// const BROWSER_WS = process.env.BROWSER_WS;

// router.post('/scrape', async (req, res) => {
//   try {
//     const { url, query } = req.body;
//     console.log('Received request with URL:', url, 'and query:', query);

//     let content;
//     if (url.includes('amazon.com')) {
//       const amazonData = await scrapeAmazonData(query);
//       content = JSON.stringify(amazonData);
//     } else {
//       const unlockerOptions = {
//         url: url,
//         proxy: process.env.WEB_UNLOCKER_PROXY,
//         rejectUnauthorized: false,
//       };

//       console.log('Making Web Unlocker request');
//       const unlockedData = await requestPromise(unlockerOptions);
//       console.log('Web Unlocker request complete');

//       content = htmlToMarkdown(unlockedData);
//     }

//     res.status(200).json({
//       content,
//     });
//   } catch (error) {
//     console.error('An error occurred:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// async function scrapeAmazonData(search_text) {
//   const browser = await puppeteer.connect({
//     browserWSEndpoint: BROWSER_WS,
//   });
//   const page = await browser.newPage();
//   await page.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
//   await searchProduct(page, search_text);
//   const data = await parseProductResults(page);
//   await browser.close();
//   return data;
// }


// async function searchProduct(page, search_text) {
//   console.log('Waiting for search bar...');
//   const search_input = await page.waitForSelector('#twotabsearchtextbox', { timeout: 60000 });
//   console.log('Search bar found! Entering search text...');
//   if (search_input) {
//     await search_input.type(search_text);
//   }
//   console.log('Search text entered. Submitting search...');
//   await Promise.all([
//     page.click('#nav-search-submit-button'),
//     page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
//   ]);
//   console.log('Search results page loaded.');
// }

// async function parseProductResults(page) {
//   return await page.$$eval('.s-result-item', (els) =>
//     els.slice(0, 10).map((el) => {
//       const name = el.querySelector('h2')?.textContent?.trim();
//       const price = el.querySelector('.a-price-whole')?.textContent;
//       const rating = el.querySelector('.a-icon-star-small')?.textContent?.trim();
//       const reviews = el.querySelector('.a-size-base.s-underline-text')?.textContent;
//       const link = el.querySelector('a.a-link-normal')?.getAttribute('href');
//       return {
//         name,
//         price,
//         rating,
//         reviews,
//         link: link ? `https://www.amazon.com${link}` : undefined,
//       };
//     }),
//   );
// }

// module.exports = router;


const express = require('express');
const requestPromise = require('request-promise');
const TurndownService = require('turndown');
const puppeteer = require('puppeteer-core');

const router = express.Router();

const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
});

turndownService.remove(['script', 'style', 'iframe', 'noscript']);

function htmlToMarkdown(html) {
  try {
    const maxLength = 500000;
    if (typeof html === 'string' && html.length > maxLength) {
      console.warn(`HTML content truncated from ${html.length} to ${maxLength} characters`);
      html = html.slice(0, maxLength) + '... (content truncated)';
    }

    console.log('Converting HTML to Markdown');
    const markdown = turndownService.turndown(html);
    console.log('Conversion complete');
    return markdown;
  } catch (error) {
    console.error('Error converting HTML to markdown:', error);
    return '[Error: Unable to convert HTML to Markdown]';
  }
}

const BROWSER_WS = process.env.BROWSER_WS;

// Improved request function with better error handling and retries
async function makeWebUnlockerRequest(url, maxRetries = 3) {
  const unlockerOptions = {
    url: url,
    proxy: process.env.WEB_UNLOCKER_PROXY,
    rejectUnauthorized: false,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    // Additional options for better proxy handling
    tunnel: true,
    followRedirect: true,
    maxRedirects: 5,
    // Connection pool settings
    pool: {
      maxSockets: 5
    }
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Making Web Unlocker request (attempt ${attempt}/${maxRetries})`);
      const response = await requestPromise(unlockerOptions);
      console.log('Web Unlocker request successful');
      return response;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Alternative approach using axios with better proxy support
async function makeWebUnlockerRequestWithAxios(url) {
  const axios = require('axios');
  const HttpsProxyAgent = require('https-proxy-agent');
  
  const proxyUrl = process.env.WEB_UNLOCKER_PROXY;
  const proxyAgent = new HttpsProxyAgent(proxyUrl);
  
  const config = {
    url: url,
    method: 'GET',
    httpsAgent: proxyAgent,
    httpAgent: proxyAgent,
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    maxRedirects: 5,
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    }
  };
  
  try {
    console.log('Making Web Unlocker request with axios');
    const response = await axios(config);
    console.log('Web Unlocker request successful');
    return response.data;
  } catch (error) {
    console.error('Axios request failed:', error.message);
    throw error;
  }
}

router.post('/scrape', async (req, res) => {
  try {
    const { url, query } = req.body;
    console.log('Received request with URL:', url, 'and query:', query);

    // Validate URL
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let content;
    if (url.includes('amazon.com')) {
      const amazonData = await scrapeAmazonData(query);
      content = JSON.stringify(amazonData);
    } else {
      try {
        // Try the improved request function first
        const unlockedData = await makeWebUnlockerRequest(url);
        content = htmlToMarkdown(unlockedData);
      } catch (error) {
        console.log('Primary method failed, trying alternative approach...');
        
        // If the primary method fails, try axios approach
        try {
          const unlockedData = await makeWebUnlockerRequestWithAxios(url);
          content = htmlToMarkdown(unlockedData);
        } catch (axiosError) {
          console.error('Both methods failed:', axiosError.message);
          throw new Error(`Failed to fetch content: ${error.message}`);
        }
      }
    }

    res.status(200).json({
      content,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    
    // More specific error messages
    let errorMessage = 'An error occurred';
    if (error.message.includes('ECONNRESET')) {
      errorMessage = 'Connection was reset by the proxy server. Please try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. The website may be slow to respond.';
    } else if (error.message.includes('tunneling socket')) {
      errorMessage = 'Proxy connection failed. Please check your proxy configuration.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

async function scrapeAmazonData(search_text) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: BROWSER_WS,
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await searchProduct(page, search_text);
    const data = await parseProductResults(page);
    return data;
  } finally {
    await browser.close();
  }
}

async function searchProduct(page, search_text) {
  console.log('Waiting for search bar...');
  const search_input = await page.waitForSelector('#twotabsearchtextbox', { timeout: 60000 });
  console.log('Search bar found! Entering search text...');
  if (search_input) {
    await search_input.type(search_text);
  }
  console.log('Search text entered. Submitting search...');
  await Promise.all([
    page.click('#nav-search-submit-button'),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  ]);
  console.log('Search results page loaded.');
}

async function parseProductResults(page) {
  return await page.$$eval('.s-result-item', (els) =>
    els.slice(0, 10).map((el) => {
      const name = el.querySelector('h2')?.textContent?.trim();
      const price = el.querySelector('.a-price-whole')?.textContent;
      const rating = el.querySelector('.a-icon-star-small')?.textContent?.trim();
      const reviews = el.querySelector('.a-size-base.s-underline-text')?.textContent;
      const link = el.querySelector('a.a-link-normal')?.getAttribute('href');
      return {
        name,
        price,
        rating,
        reviews,
        link: link ? `https://www.amazon.com${link}` : undefined,
      };
    }),
  );
}

module.exports = router;