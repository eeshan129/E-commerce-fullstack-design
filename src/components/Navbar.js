import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const [search, setSearch]     = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">MyShop</Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/"         onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
          <li>
            <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
              🛒 Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>

          {isAdmin && (
            <li><Link to="/admin" className="admin-link" onClick={() => setMenuOpen(false)}>⚙️ Admin</Link></li>
          )}

          {isLoggedIn ? (
            <li className="user-menu">
              <span className="user-name">👤 {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <li><Link to="/login" className="login-link" onClick={() => setMenuOpen(false)}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;