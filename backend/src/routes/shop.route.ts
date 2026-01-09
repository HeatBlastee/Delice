import express from "express"
import { isAuth } from "../middlewares/isAuth"
import { upload } from "../middlewares/multer"
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controller"



const shopRouter = express.Router()

shopRouter.post("/create-edit", isAuth, upload.single("image"), createEditShop)
shopRouter.get("/get-my", isAuth, getMyShop)
shopRouter.get("/get-by-city/:city", isAuth, getShopByCity)

export default shopRouter