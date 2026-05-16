import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <ul>
                <li className="mb-3">
                    <Link to="/admin" className="hover:text-gray-400">Dashboard</Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/products" className="hover:text-gray-400">Products</Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/orders" className="hover:text-gray-400">Orders</Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/users" className="hover:text-gray-400">Users</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;