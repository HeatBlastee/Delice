import { Request, Response } from "express";
import { supportAgent } from "../ai/supportAgent";
import uploadOnCloudinary from "../utils/cloudinary";
import RefundRequest from "../models/refundRequest.model";

export const handleChat = async (req: Request, res: Response): Promise<any> => {
    try {
        const { message, history } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required." });
        }

        let photoUrl = "";
        if (req.file) {
            const uploadedUrl = await uploadOnCloudinary(req.file.path);
            if (uploadedUrl) {
                photoUrl = uploadedUrl;
            }
        }

        const messages = [
            {
                role: "system",
                content: `You are a helpful customer support agent for Delice Food Delivery.
                The user ID is ${userId}. You must pass this userId to any tools you use.
                Be concise, polite, and helpful. If the user attaches an image complaining about food, use the issue_refund tool.
                CRITICAL INSTRUCTION: Never display or mention the raw MongoDB Order ID (e.g. 696c62cc...) to the user. Instead, refer to their order conversationally (e.g. "your recent order").`
            }
        ];

        if (history && typeof history === "string") {
            try {
                const parsedHistory = JSON.parse(history);
                if (Array.isArray(parsedHistory)) {
                    messages.push(...parsedHistory);
                }
            } catch (e) {
                // Ignore parse error
            }
        }

        let content: any = [{ type: "text", text: message }];
        if (photoUrl) {
            content.push({ type: "image_url", image_url: { url: photoUrl } });
            content[0].text += `\n[User attached an image: ${photoUrl}]`;
        }

        messages.push({ role: "user", content });

        const state = { messages: messages };
        const result = await supportAgent.invoke(state);
        const aiMessage = result.messages[result.messages.length - 1];

        res.status(200).json({
            success: true,
            response: aiMessage.content
        });

    } catch (error: any) {
        console.error("Support Chat Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Owner endpoints
export const getRefundRequests = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.userId;
        // In a real app, verify user is an owner, but for now we filter by shop owner or return all
        // We will just return all pending refunds for demo purposes
        const refunds = await RefundRequest.find({}).populate("user", "fullName email").populate("order", "totalAmount");
        res.status(200).json({ success: true, refunds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateRefundStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const refund = await RefundRequest.findByIdAndUpdate(id, { status }, { new: true });
        if (!refund) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true, refund });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
