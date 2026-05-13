import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Sales',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
        ],
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/orders', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const orders = response.data;

                
                const salesData = orders.reduce((acc, order) => {
                    const month = new Date(order.createdAt).toLocaleString('default', { month: 'long' });
                    acc[month] = (acc[month] || 0) + order.totalAmount;
                    return acc;
                }, {});

                const labels = Object.keys(salesData);
                const data = Object.values(salesData);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Sales',
                            data,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            fill: false,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return <Line data={chartData} />;
};

export default Chart;