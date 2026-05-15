import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-indigo-600">MyShop</Link>
      <div className="flex gap-6 text-gray-600">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <Link to="/cart" className="hover:text-indigo-600">Cart 🛒</Link>
      </div>
    </nav>
  );
}

export default Navbar;