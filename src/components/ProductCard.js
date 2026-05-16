import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // stop card click from navigating
    addToCart(product);
  };

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-img-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="stars">{stars}</span>
          <span className="reviews">({product.reviews})</span>
        </div>
        <div className="product-card-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;