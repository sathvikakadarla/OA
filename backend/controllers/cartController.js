import Cart from '../model/cartModel.js';
import Profile from '../model/Profile.js';

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
    const { mobileOrEmail, productId, quantity } = req.body;

    console.log('Add to Cart Request:', req.body);

    if (!mobileOrEmail || !productId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const profile = await getProfile(mobileOrEmail);
    if (!profile) {
      console.log('User not found for:', mobileOrEmail);
      return res.status(404).json({ message: 'User not found' });
    }

    let cart = await Cart.findOne({ profile: profile._id });

    if (!cart) {
      // If cart doesn't exist, create new cart with the item
      cart = new Cart({
        profile: profile._id,
        mobileNumber: profile.mobileNumber,
        items: [{ productId, quantity }],
      });
    } else {
      // Always push a new item, even if it's a duplicate
      cart.items.push({ productId, quantity });
    }
    
    
     
    await cart.save();
    console.log('Cart saved successfully');
    res.status(200).json({ success: true, message: 'Item added to cart', cart });

  } catch (err) {
    console.error('Error in addToCart:', err);
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
    const { mobileOrEmail, cartItemId } = req.body;

    if (!mobileOrEmail || !cartItemId) {
      return res.status(400).json({ message: 'Identifier and cartItemId required' });
    }

    const profile = await getProfile(mobileOrEmail);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ profile: profile._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed from cart', cart });

  } catch (err) {
    console.error('Error in removeFromCart:', err);
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
