import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Order from "../models/order.model";
import RefundRequest from "../models/refundRequest.model";
import { ChatOpenAI } from "@langchain/openai";
import mongoose from "mongoose";

// Tool 1: Check Order Status
export const checkOrderStatusTool = tool(
    async ({ orderId, userId }: any) => {
        try {
            let order;
            if (orderId) {
                order = await Order.findOne({ _id: orderId, user: userId }).populate("shopOrders.shopOrderItems.item");
            } else {
                // Get the most recent order for the user
                order = await Order.findOne({ user: userId }).sort({ createdAt: -1 }).populate("shopOrders.shopOrderItems.item");
            }

            if (!order) {
                return "No order found for this user.";
            }

            // Summarize order details
            const orderSummary = {
                orderId: order._id.toString(),
                totalAmount: order.totalAmount,
                createdAt: order.createdAt,
                shops: order.shopOrders.map(shopOrder => ({
                    shopId: shopOrder.shop?.toString(),
                    status: shopOrder.status,
                    items: shopOrder.shopOrderItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }))
            };

            return JSON.stringify(orderSummary, null, 2);
        } catch (error: any) {
            return `Error fetching order: ${error.message}`;
        }
    },
    {
        name: "check_order_status",
        description: "Checks the status of a user's order. If orderId is not provided, it fetches their most recent order.",
        schema: z.object({
            orderId: z.string().optional().describe("The ID of the order to check. Optional."),
            userId: z.string().describe("The ID of the user requesting the order status.")
        }),
    }
);

// Tool 2: Issue Refund
export const issueRefundTool = tool(
    async ({ orderId, userId, reason, photoUrl }: any) => {
        try {
            const order = await Order.findOne({ _id: orderId, user: userId });
            if (!order) {
                return "Order not found. Cannot issue a refund.";
            }

            // If a photoUrl is provided, verify it using AI Vision
            let adminNote = "";
            
            if (photoUrl) {
                const visionModel = new ChatOpenAI({
                    modelName: "gpt-4o",
                    maxTokens: 2048,
                    apiKey: process.env.GITHUB_TOKEN,
                    configuration: {
                        baseURL: "https://models.inference.ai.azure.com",
                    }
                });

                const prompt = `You are a refund validation assistant for a food delivery platform. 
                The user is requesting a refund for their order.
                Reason provided: "${reason}"
                Look at the provided image. Does the image support the reason? (e.g., if they say food is spilled, is it spilled? If they say missing item, is something clearly missing or empty container?).
                Reply with a short analysis and end with either "VALID" or "INVALID".`;

                const response = await visionModel.invoke([
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { type: "image_url", image_url: { url: photoUrl } }
                        ]
                    } as any
                ]);

                const aiResponse = response.content.toString();
                adminNote = `AI Vision Analysis: ${aiResponse}`;
                
                if (aiResponse.includes("INVALID")) {
                    return `Refund request declined automatically based on photo evidence. Reason: ${aiResponse}`;
                }
            }

            // We need to know which shop to issue the refund for. 
            // For simplicity, pick the first shop in the order.
            const shopId = order.shopOrders[0]?.shop;

            if (!shopId) {
                return "No shop associated with this order.";
            }

            // Create Refund Request
            const refundRequest = new RefundRequest({
                order: new mongoose.Types.ObjectId(orderId),
                user: new mongoose.Types.ObjectId(userId),
                shop: shopId,
                reason,
                photoUrl,
                status: "pending",
                adminNote
            });

            await refundRequest.save();

            return `Refund request submitted successfully and is pending human review. Refund Request ID: ${refundRequest._id}. Tell the user they will receive an update soon.`;

        } catch (error: any) {
            return `Error submitting refund request: ${error.message}`;
        }
    },
    {
        name: "issue_refund",
        description: "Creates a refund request for an order. If a photoUrl is provided, it uses AI vision to validate the image.",
        schema: z.object({
            orderId: z.string().describe("The ID of the order."),
            userId: z.string().describe("The ID of the user requesting the refund."),
            reason: z.string().describe("The reason for the refund."),
            photoUrl: z.string().optional().describe("A URL to an image provided by the user as evidence.")
        }),
    }
);
