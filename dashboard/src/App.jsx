import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, List, LogOut, Phone, History, Settings as SettingsIcon } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Login from './pages/Login';
import CallHistory from './pages/CallHistory';
import Settings from './pages/Settings';

const Layout = ({ store, onLogout, children }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <List size={20} /> },
    { name: 'Call History', path: '/calls', icon: <History size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-indigo-800">
          BoloBazaar
        </div>
        
        <nav className="flex-1 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 hover:bg-indigo-800 ${
                location.pathname === item.path ? 'bg-indigo-800 border-r-4 border-white' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-indigo-800">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-700 p-2 rounded-full mr-3 shrink-0">
              <Phone size={16} />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium truncate">{store.name}</div>
              <div className="text-xs text-indigo-300 truncate">{store.phone}</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center text-indigo-300 hover:text-white transition-colors"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem('store');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (storeData) => {
    setStore(storeData);
    localStorage.setItem('store', JSON.stringify(storeData));
  };

  const handleLogout = () => {
    setStore(null);
    localStorage.removeItem('store');
  };

  if (!store) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout store={store} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard store={store} />} />
          <Route path="/orders" element={<Orders store={store} />} />
          <Route path="/inventory" element={<Inventory store={store} />} />
          <Route path="/calls" element={<CallHistory store={store} />} />
          <Route path="/settings" element={<Settings store={store} onUpdateStore={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
