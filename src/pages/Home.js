import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Home.css';

const API_URL = 'http://localhost:5000/api';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/products/featured`);
        const data = await response.json();
        if (data.success) {
          setFeaturedProducts(data.data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Cannot connect to server. Is your backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span>MyShop</span></h1>
          <p>Your one-stop shop for everything. Discover thousands of products at unbeatable prices.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/products?category=tech" className="btn-secondary">Browse Tech</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {[
              { name: 'Tech',        emoji: '💻', slug: 'tech',        color: '#ede9fe' },
              { name: 'Interior',    emoji: '🛋️', slug: 'interior',    color: '#d1fae5' },
              { name: 'Clothing',    emoji: '👕', slug: 'cloth',       color: '#fef3c7' },
              { name: 'Accessories', emoji: '👜', slug: 'accessories', color: '#fce7f3' },
            ].map((cat) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="category-card" style={{ background: cat.color }}>
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="see-all-link">See all →</Link>
          </div>

          {loading && (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          )}

          {error && (
            <div className="error-box">
              <p>⚠️ {error}</p>
              <p>Run <code>npm run dev</code> in your backend folder.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="products-grid">
              {featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>🎉 Free Shipping on Orders Over $50</h2>
          <p>Use code <strong>MYSHOP10</strong> for 10% off your first order</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;