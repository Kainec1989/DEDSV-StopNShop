import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

function Account() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
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
      }
    };
    fetchOrders();
  }, []);

  const latestOrder = orders?.[0];
  const shippingAddress = latestOrder?.shippingAddress;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">Hello, {user?.name}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            <Link
              to="/account"
              className={`block px-4 py-2 rounded-md ${location.pathname === '/account' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Account Overview
            </Link>
            <Link
              to="/account/orders"
              className={`block px-4 py-2 rounded-md ${location.pathname === '/account/orders' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              My Orders
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">

            {/* Personal Info */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Personal Information</h2>
              <p className="text-gray-600">Name: {user?.name}</p>
              <p className="text-gray-600">Email: {user?.email}</p>
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-medium mb-2">Latest Shipping Address</h2>
              {shippingAddress ? (
                <>
                  <p className="text-gray-600">{shippingAddress.address}</p>
                  <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state}</p>
                  <p className="text-gray-600">{shippingAddress.postalCode}</p>
                  <p className="text-gray-600">{shippingAddress.country}</p>
                </>
              ) : (
                <p className="text-gray-400 text-sm">No address found. Place an order to save your address.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
