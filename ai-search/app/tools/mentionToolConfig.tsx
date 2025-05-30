export const mentionToolConfig = {
    useMentionQueries: true,
    mentionTools: [
        { id: 'llama3-70b-8192', name: 'Groq Llama3-70b-8192', logo: 'https://asset.brandfetch.io/idxygbEPCQ/idzCyF-I44.png?updated=1668515712972', functionName: 'streamChatCompletion', enableRAG: true },
        { id: 'llama3-8b-8192', name: 'Groq Llama3-8b-8192', logo: 'https://asset.brandfetch.io/idxygbEPCQ/idzCyF-I44.png?updated=1668515712972', functionName: 'streamChatCompletion', enableRAG: true },
        { id: 'mixtral-8x7b-32768', name: 'Groq Mixtral-8x7b-32768', logo: 'https://asset.brandfetch.io/idxygbEPCQ/idzCyF-I44.png?updated=1668515712972', functionName: 'streamChatCompletion', enableRAG: true },
        { id: 'web-unlock-mistral', name: 'Web Unlock / Puppeteer / Mistral', logo: './bright-data-logo.png', functionName: 'WebScraperMistral', enableRAG: false },
        { id: 'web-unlock-gemini', name: 'Web Unlock / Puppeteer / Gemini', logo: './bright-data-logo.png', functionName: 'WebScraperGemini', enableRAG: false },
    ],
};
