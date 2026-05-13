import React, { useState, useEffect } from "react";
import Layout from "../../components/admin-view/Layout";
import Chart from '../../components/admin-view/Chart';
import axios from 'axios';

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        

        const [ordersResponse, usersResponse] = await Promise.all([
          axios.get('/api/orders', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          axios.get('/api/users', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        const orders = ordersResponse.data;
        const users = usersResponse.data;

        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalOrders = orders.length;
        const totalUsers = users.length;

        setTotalSales(totalSales);
        setTotalOrders(totalOrders);
        setTotalUsers(totalUsers);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Sales</h2>
          <p className="text-gray-600">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p className="text-gray-600">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-gray-600">{totalUsers}</p>
        </div>
      </div>
      <div className="mt-6">
        <Chart />
      </div>
    </Layout>
  );
};

export default Dashboard;