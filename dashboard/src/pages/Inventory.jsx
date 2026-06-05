import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Inventory = ({ store }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`http://localhost:8001/stores/${store.id}/inventory/`);
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center">
          <Plus className="mr-2" size={20} /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Item Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Unit</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{item.item_name}</td>
                <td className="p-4">₹{item.price}</td>
                <td className="p-4">{item.unit}</td>
                <td className="p-4">{item.stock_count}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.is_available ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 mr-3 hover:text-blue-800"><Edit size={18} /></button>
                  <button className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
