export const config = {
    useOllamaInference: false,
    useOllamaEmbeddings: false,
    searchProvider: 'serper',
    inferenceModel: 'llama-3.3-70b-versatile',
    inferenceAPIKey: process.env.GROQ_API_KEY, 
    embeddingsModel: 'text-embedding-3-small', 
    textChunkSize: 800,
    textChunkOverlap: 200,
    numberOfSimilarityResults: 4,
    numberOfPagesToScan: 10,
    nonOllamaBaseURL: 'https://api.groq.com/openai/v1',
    useFunctionCalling: true,
    useRateLimiting: false,
    useSemanticCache: false,
}