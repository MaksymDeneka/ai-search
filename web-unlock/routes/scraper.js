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
const fetch = require('node-fetch'); // Make sure to install: npm install node-fetch
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
const BRIGHT_DATA_TOKEN =
  process.env.BRIGHT_DATA_TOKEN ||
  '1f36d6e116efd1649ce4b9403d7c1cbd467b5de97c97cab619163fcf21acb9c4';
const BRIGHT_DATA_ZONE = process.env.BRIGHT_DATA_ZONE || 'web_unlocker1';

// New function to use Bright Data API instead of proxy
async function scrapeWithBrightDataAPI(url) {
  try {
    console.log('Making Bright Data API request for URL:', url);

    const response = await fetch('https://api.brightdata.com/request', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BRIGHT_DATA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zone: BRIGHT_DATA_ZONE,
        url: url,
        format: 'raw', // Use 'raw' to get HTML content, 'json' for structured data
      }),
    });

    if (!response.ok) {
      throw new Error(`Bright Data API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.text(); // Use .text() for HTML content
    console.log('Bright Data API request complete');

    return data;
  } catch (error) {
    console.error('Error with Bright Data API:', error);
    throw error;
  }
}

// Alternative function if you need JSON response format
async function scrapeWithBrightDataAPIJson(url) {
  try {
    console.log('Making Bright Data API request (JSON) for URL:', url);

    const response = await fetch('https://api.brightdata.com/request', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BRIGHT_DATA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zone: BRIGHT_DATA_ZONE,
        url: url,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Bright Data API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Bright Data API request (JSON) complete');

    // Extract HTML from the JSON response
    return data.html || data.content || data;
  } catch (error) {
    console.error('Error with Bright Data API (JSON):', error);
    throw error;
  }
}

router.post('/scrape', async (req, res) => {
  try {
    const { url, query } = req.body;
    console.log('Received request with URL:', url, 'and query:', query);

    let content;
    if (url.includes('amazon.com')) {
      const amazonData = await scrapeAmazonData(query);
      content = JSON.stringify(amazonData);
    } else {
      // Use the new API-based approach instead of proxy
      try {
        const htmlContent = await scrapeWithBrightDataAPI(url);
        content = htmlToMarkdown(htmlContent);
      } catch (apiError) {
        console.log('API method failed, trying JSON format:', apiError.message);
        // Fallback to JSON format if raw format fails
        const htmlContent = await scrapeWithBrightDataAPIJson(url);
        content = htmlToMarkdown(htmlContent);
      }
    }

    res.status(200).json({
      content,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({
      error: 'An error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

async function scrapeAmazonData(search_text) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: BROWSER_WS,
  });
  const page = await browser.newPage();
  await page.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await searchProduct(page, search_text);
  const data = await parseProductResults(page);
  await browser.close();
  return data;
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
