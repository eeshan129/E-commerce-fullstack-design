import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res  = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        if (data.success) setProduct(data.data);
        else setError('Product not found');
      } catch {
        setError('Cannot connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="detail-page"><div className="detail-container"><div className="detail-skeleton">Loading...</div></div></div>;
  if (error)   return <div className="detail-page"><div className="detail-container"><div className="error-box"><p>⚠️ {error}</p><Link to="/products">← Back</Link></div></div></div>;

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> › <Link to="/products">Products</Link> › {product.name}
        </div>

        <div className="detail-layout">
          <div className="detail-image-box">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              <span className="stars">{stars}</span>
              <span className="reviews-count">{product.reviews} reviews</span>
            </div>

            <div className="detail-price">${product.price.toFixed(2)}</div>
            <p className="detail-description">{product.description}</p>

            <div className="detail-stock">
              {product.stock > 0
                ? <span className="in-stock">✅ In Stock ({product.stock} available)</span>
                : <span className="out-stock">❌ Out of Stock</span>}
            </div>

            {product.stock > 0 && (
              <div className="qty-selector">
                <label>Quantity:</label>
                <div className="qty-controls">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                </div>
              </div>
            )}

            <button
              className={`detail-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? '✅ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>

            <Link to="/cart" className="detail-view-cart">View Cart →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;