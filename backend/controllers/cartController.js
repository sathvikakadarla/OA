import Cart from '../model/cartModel.js';
import Profile from '../model/Profile.js';
import FoodModel from '../model/foodModel.js';

// Get profile by mobileNumber or email
const getProfile = async (identifier) => {
  if (!identifier) {
    throw new Error('Identifier required');
  }
  return await Profile.findOne({
    $or: [{ mobileNumber: identifier }, { email: identifier }],
  });
};

export const addToCart = async (req, res) => {
  try {
    const { mobileOrEmail, productId } = req.body;
    const quantityInGrams = req.body.quantityInGrams ?? req.body.quantity;


    console.log('Admin Add to Cart:', req.body);

    if (!mobileOrEmail || !productId || typeof quantityInGrams !== 'number' || quantityInGrams <= 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const profile = await getProfile(mobileOrEmail);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    const food = await FoodModel.findById(productId);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const unitGrams = food.quantity; // e.g., 1000g per unit
    const quantityInUnit = Math.ceil(quantityInGrams / unitGrams);

    let cart = await Cart.findOne({ profile: profile._id });

    if (!cart) {
      cart = new Cart({
        profile: profile._id,
        mobileNumber: profile.mobileNumber,
        items: [{ productId, quantityInUnit, quantityInGrams }],
      });
    } else {
      const existingIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingIndex !== -1) {
        cart.items[existingIndex].quantityInUnit += quantityInUnit;
        cart.items[existingIndex].quantityInGrams += quantityInGrams;
      } else {
        cart.items.push({ productId, quantityInUnit, quantityInGrams });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: 'Item added to cart', cart });

  } catch (err) {
    console.error('Admin addToCart error:', err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};



export const getCart = async (req, res) => {
    try {
      const { mobileOrEmail } = req.body;
  
      if (!mobileOrEmail) {
        return res.status(400).json({ message: 'Identifier required' });
      }
  
      const profile = await getProfile(mobileOrEmail);
      if (!profile) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch cart and populate productId
      const cart = await Cart.findOne({ profile: profile._id })
        .populate({
          path: 'items.productId',
          model: 'Food',
          select: 'name description price category quantity shopId',
          populate: {
            path: 'shopId',
            model: 'Shop',
            select: 'name'
          }
        })

        .exec();
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Debug: Log the populated cart object
      console.log('Populated Cart:', JSON.stringify(cart, null, 2));  // JSON.stringify for better visibility
  
      const flatItems = cart.items.map(item => ({
        _id: item._id,
        productId: item.productId,
        quantity: item.quantity
      }));
  
      res.status(200).json({ success: true, cart: { items: flatItems } });
  
    } catch (err) {
      console.error('Error fetching cart:', err);
      res.status(500).json({ message: 'Failed to fetch cart' });
    }
  };
  

export const removeFromCart = async (req, res) => {
  try {
    const { mobileOrEmail, productId } = req.body;

    if (!mobileOrEmail || !productId) {
      return res.status(400).json({ message: 'Identifier and productId required' });
    }

    const profile = await getProfile(mobileOrEmail);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ profile: profile._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed from cart', cart });

  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { mobileOrEmail } = req.body;

    if (!mobileOrEmail) {
      return res.status(400).json({ message: 'Identifier required' });
    }

    const profile = await getProfile(mobileOrEmail);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ profile: profile._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: 'Cart cleared' });

  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};
