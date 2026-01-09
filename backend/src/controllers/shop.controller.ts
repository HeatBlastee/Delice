import { Request, Response } from "express";
import Shop from "../models/shop.model";
import uploadOnCloudinary from "../utils/cloudinary";

/**
 * Extending the Request interface to include properties 
 * added by your auth and multer middlewares.
 */
interface AuthenticatedRequest extends Request {
    userId?: string; // This should be required if the route is protected
    file?: Express.Multer.File;
}

export const createEditShop = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const { name, city, state, address } = req.body;
        let imageUrl: string | null = null;

        // Handle Image Upload
        if (req.file) {
            const uploadedImageUrl = await uploadOnCloudinary(req.file.path);
            imageUrl = uploadedImageUrl;
        }

        let shop = await Shop.findOne({ owner: req.userId });

        const shopData = {
            name,
            city,
            state,
            address,
            owner: req.userId,
            imageUrl
        };

        if (!shop) {
            shop = await Shop.create(shopData);
        } else {
            shop = await Shop.findByIdAndUpdate(shop._id, shopData, { new: true });
        }

        if (!shop) {
            return res.status(404).json({ message: "Shop not found or created" });
        }

        await shop.populate("owner items");
        return res.status(201).json(shop);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ message: `Create/Edit shop error: ${errorMessage}` });
    }
};

export const getMyShop = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const shop = await Shop.findOne({ owner: req.userId })
            .populate("owner")
            .populate({
                path: "items",
                options: { sort: { updatedAt: -1 } },
            });

        if (!shop) {
            // Return a 404 response instead of null
            return res.status(404).json({ message: "Shop not found" });
        }

        return res.status(200).json(shop);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ message: `Get my shop error: ${errorMessage}` });
    }
};

export const getShopByCity = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { city } = req.params;

        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") },
        }).populate("items");

        if (!shops || shops.length === 0) {
            return res.status(404).json({ message: "No shops found in this city" });
        }

        return res.status(200).json(shops);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ message: `Get shop by city error: ${errorMessage}` });
    }
};
