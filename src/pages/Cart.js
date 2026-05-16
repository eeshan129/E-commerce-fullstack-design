import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn-shop-now">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 50 ? 0 : 5.99;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <span className="cart-item-category">{item.category}</span>
                  <h3 className="cart-item-name">{item.name}</h3>
                  <span className="cart-item-price">${item.price.toFixed(2)} each</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-controls">
                    <button onClick={() => item.quantity === 1 ? removeFromCart(item._id) : updateQty(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-ship">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${(cartTotal + shipping).toFixed(2)}</span>
            </div>
            {cartTotal < 50 && (
              <p className="ship-notice">Add ${(50 - cartTotal).toFixed(2)} more for free shipping!</p>
            )}
            <button className="checkout-btn">Proceed to Checkout</button>
            <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;