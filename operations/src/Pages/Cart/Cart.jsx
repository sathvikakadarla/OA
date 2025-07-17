import React, { useState, useEffect } from 'react';
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Cart = () => {
  const isMobile = useIsMobile();
  const [mobileNumber, setMobileNumber] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:2000/api/food/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    fetch(`https://oa-backend-qdbq.onrender.com/api/food/shops/by-category?category=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => setShops(data.shops || []))
      .catch(() => toast.error('Failed to load shops'));
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedCategory || !selectedShop) return;
    fetch(`https://oa-backend-qdbq.onrender.com/api/food/list?category=${selectedCategory}&shopId=${selectedShop}`)
      .then((res) => res.json())
      .then((data) => setFilteredFoodItems(data.foodItems || []))
      .catch(() => toast.error('Failed to load food items'));
  }, [selectedCategory, selectedShop]);

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) setMobileNumber(value);
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`https://oa-backend-qdbq.onrender.com/api/profile/${mobileNumber}`);
      const data = await res.json();
      if (res.ok) {
        setUserProfile(data);
        setError('');
        toast.success('Profile fetched');
      } else {
        setUserProfile(null);
        setError(data.message || 'Not found');
        toast.error('Profile not found');
      }
    } catch {
      toast.error('Error fetching profile');
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`https://oa-backend-qdbq.onrender.com/api/cart/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileOrEmail: mobileNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart.items || []);
        toast.success('Cart fetched');
      } else {
        setCartItems([]);
        toast.error(data.message || 'No cart');
      }
    } catch {
      toast.error('Error fetching cart');
    }
  };

  const handleAddItemToCart = async (productId, quantityInGrams = 1) => {
    if (!userProfile) return toast.error('Load user profile first');
    try {
      const res = await fetch(`https://oa-backend-qdbq.onrender.com/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileOrEmail: mobileNumber,
          productId,
          quantity: quantityInGrams,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Added to cart');
        fetchCart();
      } else {
        toast.error(data.message || 'Add failed');
      }
    } catch {
      toast.error('Error adding to cart');
    }
  };

const handleEditItem = async (item) => {
  const category = item.productId?.category?.toLowerCase();
  const isEggs = category === 'eggs';

  const currentQty = item.quantityInGrams;

  const newQty = prompt(
    `Enter new quantity${isEggs ? ' (number of eggs)' : ' (in grams)'}`,
    currentQty
  );

  const quantityNum = parseInt(newQty, 10);
  if (isNaN(quantityNum) || quantityNum <= 0) return toast.error('Invalid quantity');

  try {
    const removeRes = await fetch(`https://oa-backend-qdbq.onrender.com/api/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobileOrEmail: mobileNumber,
        productId: item.productId._id,  // ✅ Use productId instead of cartItemId
      }),
    });

    const removeData = await removeRes.json();
    if (!removeRes.ok) return toast.error(removeData.message || 'Failed to remove existing item');

    await handleAddItemToCart(item.productId._id, quantityNum);
  } catch (err) {
    console.error(err);
    toast.error('Error updating item');
  }
};



  const handleDeleteItem = async (item) => {
  try {
    const res = await fetch(`https://oa-backend-qdbq.onrender.com/api/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobileOrEmail: mobileNumber,
        productId: item.productId._id,  // ✅ Use productId here too
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Removed from cart');
      fetchCart();
    } else {
      toast.error(data.message || 'Failed to remove');
    }
  } catch {
    toast.error('Error removing item');
  }
};


  const handleDropdownAdd = () => {
    if (!selectedFoodItem || selectedQuantity <= 0) {
      return toast.error('Select valid food & quantity');
    }

    const product = filteredFoodItems.find(i => i._id === selectedFoodItem);
    if (!product) return toast.error('Invalid product');

    const quantityInGrams = selectedQuantity * product.quantity;
    handleAddItemToCart(selectedFoodItem, quantityInGrams);
  };

  const selectedProduct = filteredFoodItems.find(i => i._id === selectedFoodItem);

  return (
    <>
      <div className="credit-to-wallet-container">
        <div className="credit-to-wallet-inner-container">
          {/* --- SPLIT BLOCKS --- */}
          <div className="top-row">
            {/* LEFT SIDE: Profile Section */}
            <div className="left-panel">
              <div className="input-section">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  placeholder="Enter mobile number"
                  maxLength="10"
                />
                <button onClick={fetchProfile}>Fetch Profile</button>
              </div>

              {userProfile && (
                <div className="profile-details">
                  <h3>User Profile</h3>
                  <p><strong>Name:</strong> {userProfile.name}</p>
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Mobile:</strong> {userProfile.mobileNumber}</p>
                  <p><strong>Balance:</strong> ₹{userProfile.currentBalance}</p>
                  <button onClick={fetchCart}>View Cart</button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Add to Cart */}
            {userProfile && (
              <div className="middle-panel">
                <div className="dropdown-selection">
                  <h3>Add Food via Selection</h3>
                  <div className="dropdown-group">
                    <label>Select Category</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      <option value="">-- Category --</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {shops.length > 0 && (
                    <div className="dropdown-group">
                      <label>Select Shop</label>
                      <select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}>
                        <option value="">-- Shop --</option>
                        {shops.map((shop) => (
                          <option key={shop._id} value={shop._id}>{shop.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {filteredFoodItems.length > 0 && (
                    <>
                      <div className="dropdown-group">
                        <label>Select Food Item</label>
                        <select
                          value={selectedFoodItem}
                          onChange={(e) => {
                            setSelectedFoodItem(e.target.value);
                            setSelectedQuantity(1);
                          }}
                        >
                          <option value="">-- Food Item --</option>
                          {filteredFoodItems.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name} - ₹{item.price} ({item.quantity}g)
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedProduct && (
                        <div className="dropdown-group">
                          <label>Quantity (× {selectedProduct.quantity}g)</label>
                          <input
                            type="number"
                            min="1"
                            value={selectedQuantity}
                            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                          />
                          <div><strong>Total: ₹{selectedProduct.price * selectedQuantity}</strong></div>
                        </div>
                      )}

                      <button onClick={handleDropdownAdd}>Add to Cart</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- CART DISPLAY --- */}
          {cartItems.length > 0 && (
            isMobile ? (
              <div className="cart-cards">
                <h3>Cart Items</h3>
                {cartItems.map((item) => {
                  const product = item.productId;
                  const unitQty = product?.quantity || 1000;
                  const unitPrice = product?.price || 0;
                  const selectedQty = item.quantityInGrams || 0;
                  const totalPrice = Math.round((selectedQty / unitQty) * unitPrice);

                  return (
                    <div className="cart-card" key={item._id}>
                      <p><strong>Name:</strong> {product?.name}</p>
                      <p><strong>Description:</strong> {product?.description}</p>
                      <p><strong>Category:</strong> {product?.category}</p>
                      <p><strong>Shop:</strong> {product?.shopId?.name || 'N/A'}</p>
<p><strong>Quantity:</strong> {
  product?.category.toLowerCase() === 'eggs'
    ? `${selectedQty} (${selectedQty / 12} dozens)`
    : `${selectedQty}g`
}</p>
                      <p><strong>Price:</strong> ₹{unitPrice} (for {
  product?.category?.toLowerCase() === 'eggs'
    ? unitQty
    : `${unitQty}g`
})</p>
                      <p><strong>Total:</strong> ₹{totalPrice}</p>
                      <div className="card-buttons">
                        <button onClick={() => handleEditItem(item)}>Edit</button>
                        <button onClick={() => handleDeleteItem(item)}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cart-table">
                <h3>Cart Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Shop</th>
                      <th>Total Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Edit</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      const product = item.productId;
                      const unitQty = product?.quantity || 1000;
                      const unitPrice = product?.price || 0;
                      const selectedQty = item.quantityInGrams || 0;
                      const totalPrice = Math.round((selectedQty / unitQty) * unitPrice);

                      return (
                        <tr key={item._id}>
                          <td>{product?.name}</td>
                          <td>{product?.description}</td>
                          <td>{
  product?.category.toLowerCase() === 'eggs'
    ? `${selectedQty} (${selectedQty / 12} dozens)`
    : `${selectedQty}g`
}</td>
                          <td>{product?.shopId?.name || 'N/A'}</td>
                          <td>
  {product?.category?.toLowerCase() === 'eggs'
    ? selectedQty
    : `${selectedQty}g`}
</td>
                          <td>
  ₹{unitPrice} (for {
    product?.category?.toLowerCase() === 'eggs'
      ? unitQty
      : `${unitQty}g`
  })
</td>
                          <td>₹{totalPrice}</td>
                          <td><button onClick={() => handleEditItem(item)}>Edit</button></td>
                          <td><button onClick={() => handleDeleteItem(item)}>Delete</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {/* Toast container must be outside scrollable or clipped containers */}
      <ToastContainer />
    </>
  );
};

export default Cart;
