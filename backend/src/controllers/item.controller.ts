import { Request, Response } from "express";
import Item from "../models/item.model";
import Shop from "../models/shop.model";
import uploadOnCloudinary from "../utils/cloudinary";
import mongoose from "mongoose";

// Extend Express Request to include properties added by middleware (Auth/Multer)
interface AuthenticatedRequest extends Request {
    userId?: string;
    file?: Express.Multer.File;
}

export const addItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, category, foodType, price } = req.body;
        let image: string | undefined;

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            image = result ?? undefined;
        }

        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(400).json({ message: "shop not found" });
        }

        const item = await Item.create({
            name,
            category,
            foodType,
            price: Number(price), // Ensure price is a number
            image,
            shop: shop._id,
        });

        shop.items.push(item._id as mongoose.Types.ObjectId);
        await shop.save();

        await shop.populate("owner");
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } },
        });

        return res.status(201).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `add item error ${error}` });
    }
};

export const editItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { itemId } = req.params;
        const { name, category, foodType, price } = req.body;

        let image: string | undefined;
        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            image = result ?? undefined;
        }

        // Update only the fields provided
        const updateData: any = { name, category, foodType, price };
        if (image) updateData.image = image;

        const item = await Item.findByIdAndUpdate(itemId, updateData, { new: true });

        if (!item) {
            return res.status(400).json({ message: "item not found" });
        }

        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } },
        });

        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `edit item error ${error}` });
    }
};

export const getItemById = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(400).json({ message: "item not found" });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ message: `get item error ${error}` });
    }
};

export const deleteItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
            return res.status(400).json({ message: "item not found" });
        }

        const shop = await Shop.findOne({ owner: req.userId });
        if (shop) {
            // Fix: Compare string IDs because ObjectId objects won't match strictly
            shop.items = shop.items.filter((id) => id.toString() !== itemId);
            await shop.save();
            await shop.populate({
                path: "items",
                options: { sort: { updatedAt: -1 } },
            });
        }

        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `delete item error ${error}` });
    }
};

export const getItemByCity = async (req: Request, res: Response) => {
    try {
        const { city } = req.params;
        if (!city) {
            return res.status(400).json({ message: "city is required" });
        }

        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") },
        });

        const shopIds = shops.map((shop) => shop._id);
        const items = await Item.find({ shop: { $in: shopIds } }).populate("shop", "name image");

        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ message: `get item by city error ${error}` });
    }
};

export const getItemsByShop = async (req: Request, res: Response) => {
    try {
        const { shopId } = req.params;
        const shop = await Shop.findById(shopId).populate("items");
        if (!shop) {
            return res.status(400).json("shop not found");
        }
        return res.status(200).json({
            shop,
            items: shop.items,
        });
    } catch (error) {
        return res.status(500).json({ message: `get item by shop error ${error}` });
    }
};

export const searchItems = async (req: Request, res: Response) => {
    try {
        const { query, city } = req.query;
        if (!query || !city) {
            return res.status(400).json({ message: "Query and city are required" });
        }

        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city as string}$`, "i") },
        });

        const shopIds = shops.map((s) => s._id);
        const items = await Item.find({
            shop: { $in: shopIds },
            $or: [
                { name: { $regex: query as string, $options: "i" } },
                { category: { $regex: query as string, $options: "i" } },
            ],
        }).populate("shop", "name image");

        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ message: `search item error ${error}` });
    }
};

export const rating = async (req: Request, res: Response) => {
    try {
        const { itemId, rating } = req.body;

        if (!itemId || rating === undefined) {
            return res.status(400).json({ message: "itemId and rating is required" });
        }

        const numRating = Number(rating);
        if (numRating < 1 || numRating > 5) {
            return res.status(400).json({ message: "rating must be between 1 to 5" });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(400).json({ message: "item not found" });
        }

        const newCount = (item.rating?.count || 0) + 1;
        const currentAverage = item.rating?.average || 0;
        const newAverage = (currentAverage * (item.rating?.count || 0) + numRating) / newCount;

        item.rating = {
            count: newCount,
            average: newAverage,
        };

        await item.save();
        return res.status(200).json({ rating: item.rating });
    } catch (error) {
        return res.status(500).json({ message: `rating error ${error}` });
    }
};