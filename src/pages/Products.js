import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

const API_URL = 'http://localhost:5000/api';
const CATEGORIES = ['all', 'tech', 'interior', 'cloth', 'accessories'];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery    = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_URL}/products?`;
        if (searchQuery)                          url += `search=${encodeURIComponent(searchQuery)}&`;
        if (categoryFilter && categoryFilter !== 'all') url += `category=${categoryFilter}`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          setError('Failed to load products');
        }
      } catch {
        setError('Cannot connect to server. Is your backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryFilter]);

  const handleCategory = (cat) => {
    const params = {};
    if (cat !== 'all') params.category = cat;
    if (searchQuery)   params.search   = searchQuery;
    setSearchParams(params);
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h1>
          {!loading && <span className="product-count">{products.length} products found</span>}
        </div>

        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="products-grid-page">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        )}

        {error && <div className="error-box"><p>⚠️ {error}</p></div>}

        {!loading && !error && products.length === 0 && (
          <div className="no-results">
            <p>😕 No products found. Try a different search or category.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid-page">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;