import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
// @ts-ignore
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { checkOrderStatusTool, issueRefundTool } from "./tools";

// Initialize the model
const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
    apiKey: process.env.GITHUB_TOKEN,
    configuration: {
        baseURL: "https://models.inference.ai.azure.com",
    }
});

// Bind tools to the model
const tools = [checkOrderStatusTool, issueRefundTool];
const modelWithTools = llm.bindTools(tools as any);

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
    const messages = state.messages;
    const response = await modelWithTools.invoke(messages);
    return { messages: [response] };
}

// Define the function that determines whether to continue or not
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    // If the LLM makes a tool call, then we route to the "tools" node
    if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length > 0) {
        return "tools";
    }
    // Otherwise, we stop (end)
    return "__end__";
}

// Define the graph
const workflow = new StateGraph(MessagesAnnotation)
    // Add the agent node
    .addNode("agent", callModel)
    // Add the tools node
    .addNode("tools", new ToolNode(tools))
    // Set the entry point to the agent
    .addEdge("__start__", "agent")
    // Add conditional edges from the agent
    .addConditionalEdges("agent", shouldContinue, {
        tools: "tools",
        __end__: "__end__"
    })
    // Add an edge from tools back to the agent
    .addEdge("tools", "agent");

// Compile the graph
export const supportAgent = workflow.compile();
