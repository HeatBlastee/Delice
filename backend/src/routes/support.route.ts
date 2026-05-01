import express from "express";
import { isAuth } from "../middlewares/isAuth";
import { upload } from "../middlewares/multer";
import { handleChat, getRefundRequests, updateRefundStatus } from "../controllers/support.controller";

const router: express.Router = express.Router();

// Chat endpoint (with optional photo upload)
router.post("/chat", isAuth, upload.single("photo"), handleChat);

// Owner endpoints
router.get("/refunds", isAuth, getRefundRequests);
router.put("/refunds/:id", isAuth, updateRefundStatus);

export default router;
