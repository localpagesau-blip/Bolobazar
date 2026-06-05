import React, { useState, useEffect } from 'react';
import { ShoppingCart, PhoneCall, Package, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ store }) => {
  const [stats, setStats] = useState({ total_orders: 0, total_calls: 0, pending_orders: 0, missed_calls: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:8001/stores/${store.id}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const data = [
    { name: 'Mon', calls: 20, orders: 5 },
    { name: 'Tue', calls: 35, orders: 12 },
    { name: 'Wed', calls: 25, orders: 8 },
    { name: 'Thu', calls: 45, orders: 15 },
    { name: 'Fri', calls: 30, orders: 10 },
    { name: 'Sat', calls: 55, orders: 22 },
    { name: 'Sun', calls: 40, orders: 18 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Store Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full mr-4">
            <PhoneCall size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Calls Answered</div>
            <div className="text-2xl font-bold">{stats.total_calls}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex items-center border-l-4 border-red-500">
          <div className="p-4 bg-red-100 text-red-600 rounded-full mr-4">
            <PhoneCall size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Missed Calls</div>
            <div className="text-2xl font-bold">{stats.missed_calls}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-green-100 text-green-600 rounded-full mr-4">
            <ShoppingCart size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Orders Captured</div>
            <div className="text-2xl font-bold">{stats.total_orders}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full mr-4">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Pending Orders</div>
            <div className="text-2xl font-bold">{stats.pending_orders}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Weekly Performance</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#4f46e5" name="Calls" />
              <Line type="monotone" dataKey="orders" stroke="#10b981" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
