import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore.js';

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/account/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, isCheckingAuth]);

  const menuItems = [
    { path: '/account', label: 'Account Overview' },
    { path: '/account/orders', label: 'My Orders' },
  ];

  if (isCheckingAuth) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">Hello, {user?.name}</h1>
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-md transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4 border-b pb-3">My Orders</h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-400">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-5xl mb-4">🛍️</div>
                <p className="text-gray-500 font-medium">No orders yet</p>
                <p className="text-gray-400 text-sm mt-1">Your order history will appear here.</p>
                <Link
                  to="/products"
                  className="mt-4 px-6 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                    
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Order ID</span>
                        <p className="text-sm font-mono text-gray-700">{order._id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.isPaid
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-50 my-3" />

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Date</span>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Total</span>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          €{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Shipping Address</span>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Orders;
