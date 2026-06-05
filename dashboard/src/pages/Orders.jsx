import React, { useState, useEffect } from 'react';

const Orders = ({ store }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8001/stores/${store.id}/orders/`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:8001/orders/${orderId}/status?status=${status}`, { method: 'PATCH' });
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-lg font-bold">Order #${order.id}</div>
                <div className="text-gray-500 text-sm">${new Date(order.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center">
                <span className={`mr-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
                <select 
                  className="border rounded p-1 text-sm"
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="font-medium">{order.customer_name || 'Anonymous Customer'}</div>
              <div className="text-gray-600 text-sm">{order.customer_phone}</div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
