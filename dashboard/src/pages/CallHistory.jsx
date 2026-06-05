import React, { useState, useEffect } from 'react';
import { Phone, Clock, FileText, ExternalLink } from 'lucide-react';

const CallHistory = ({ store }) => {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await fetch(`http://localhost:8001/stores/${store.id}/calls/`);
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Call History</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Time</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Outcome</th>
              <th className="p-4 text-right">Transcript</th>
            </tr>
          </thead>
          <tbody>
            {calls.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No calls recorded yet.</td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr key={call.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-600">
                        <Phone size={16} />
                      </div>
                      <span className="font-medium">{call.customer_phone}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{new Date(call.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-sm text-gray-600">{call.duration ? `${call.duration}s` : 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      call.outcome === 'order_placed' ? 'bg-green-100 text-green-800' : 
                      call.outcome === 'inquiry' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {call.outcome || 'Unknown'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center justify-end w-full">
                      <FileText size={16} className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallHistory;
