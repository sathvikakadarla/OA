import express from 'express';
import { addToCart, getCart, removeFromCart, clearCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post("/get", getCart);
cartRouter.post("/add", addToCart);
cartRouter.post("/remove", removeFromCart);
cartRouter.post("/clear", clearCart);

export default cartRouter;
