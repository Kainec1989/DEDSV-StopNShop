import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/admin-view/Layout';


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchOrders = async () => {
            console.log("Fetching orders...");
            try {
                const response = await axios.get('/api/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOrders(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching orders');
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders();
    }, []);


    const handleDeleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            await axios.delete(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting order');
            console.error('Error deleting order:', err);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Orders</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">ID</th>
                            <th className="text-left">Customer Name</th>
                            <th className="text-left">Email</th>
                            <th className="text-left">Items</th>
                            <th className="text-left">Total Amount</th>
                            <th className="text-left">Shipping Address</th>
                            <th className="text-left">Created At</th>
                            <th className="text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-t">
                                <td className="py-2">{order._id}</td>
                                <td className="py-2">{order.customerName}</td>
                                <td className="py-2">{order.email}</td>
                                <td className="py-2">
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.name} - {item.quantity} x ${item.price}
                                        </div>
                                    ))}
                                </td>
                                <td className="py-2">${order.totalAmount}</td>
                                <td className="py-2">
                                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </td>
                                <td className="py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminOrders;