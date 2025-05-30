import { mentionToolConfig } from './mentionToolConfig';

import { streamChatCompletion } from './mentionFunctions/streamChatCompletion';
// import { portKeyAIGateway } from './mentionFunctions/portKeyAIGateway';
// import { portKeyAIGatewayTogetherAI } from './mentionFunctions/portKeyAIGatewayTogetherAI';
import { WebScraperMistral } from './mentionFunctions/structuredUnlockSummarizeMistral';
import { WebScraperGemini } from './mentionFunctions/structuredUnlockSummarizeGemini';

type MentionFunctions = {
    [key: string]: (mentionTool: string, userMessage: string, streamable: any) => Promise<void>;
};

export const mentionFunctions: MentionFunctions = {
    streamChatCompletion,
    // portKeyAIGateway,
    // portKeyAIGatewayTogetherAI,
    WebScraperMistral,
    WebScraperGemini,
};

export async function lookupTool(mentionTool: string, userMessage: string, streamable: any, file?: string): Promise<void> {
    const toolInfo = mentionToolConfig.mentionTools.find(tool => tool.id === mentionTool);
    if (toolInfo) {
        if (file) {
            const decodedFile = await Buffer.from(file, 'base64').toString('utf-8').replace(/^data:image\/\w+;base64,/, '');
            await mentionFunctions[toolInfo.functionName](mentionTool, userMessage + "File Content: " + decodedFile, streamable);
        } else {
            await mentionFunctions[toolInfo.functionName](mentionTool, userMessage, streamable);
        }
    }
}