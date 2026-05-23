import React, { useEffect, useState } from 'react';
import api from '../api';
import './AdminPanel.css';

const EMPTY_FORM = {
  name: '', price: '', image: '', description: '',
  category: 'tech', stock: '', rating: '4.0', reviews: '0', featured: false,
};

function AdminPanel() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);  // null = creating, id = editing
  const [showForm, setShowForm]   = useState(false);
  const [message, setMessage]     = useState('');

  // Load all products when page opens
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch {
      setMessage('❌ Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating), reviews: Number(form.reviews) };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('✅ Product updated successfully!');
      } else {
        await api.post('/products', payload);
        setMessage('✅ Product created successfully!');
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();  // refresh the list
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Something went wrong'));
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name, price: product.price, image: product.image,
      description: product.description, category: product.category,
      stock: product.stock, rating: product.rating, reviews: product.reviews,
      featured: product.featured,
    });
    setEditingId(product._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage('✅ Product deleted');
      fetchProducts();
    } catch {
      setMessage('❌ Delete failed');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>⚙️ Admin Panel</h1>
          {!showForm && (
            <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Product</button>
          )}
        </div>

        {message && <div className="admin-message">{message}</div>}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="admin-form-card">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Smart Watch Pro" />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="e.g. 49.99" />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} required placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe the product..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="tech">Tech</option>
                    <option value="interior">Interior</option>
                    <option value="cloth">Cloth</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required placeholder="e.g. 50" />
                </div>
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  &nbsp; Featured product (show on Home page)
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">{editingId ? 'Save Changes' : 'Create Product'}</button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="admin-table-card">
          <h2>All Products ({products.length})</h2>
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td><img src={p.image} alt={p.name} className="table-img" /></td>
                      <td className="product-name-cell">{p.name}</td>
                      <td><span className="category-badge">{p.category}</span></td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>{p.featured ? '✅' : '—'}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;