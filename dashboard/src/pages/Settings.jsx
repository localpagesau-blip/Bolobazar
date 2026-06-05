import React, { useState } from 'react';
import { Save, Smartphone, Globe, Clock, CreditCard, MessageCircle, CheckCircle } from 'lucide-react';

const Settings = ({ store, onUpdateStore }) => {
  const [formData, setFormData] = useState({
    name: store.name,
    owner_name: store.owner_name || '',
    phone: store.phone,
    address: store.address || '',
    language_preference: store.language_preference,
    subscription_tier: store.subscription_tier,
    whatsapp_notifications_enabled: store.whatsapp_notifications_enabled || false,
    whatsapp_number: store.whatsapp_number || '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`http://localhost:8001/stores/${store.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedStore = await response.json();
        onUpdateStore(updatedStore);
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Smartphone className="mr-2" size={20} /> Store Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
              <input 
                type="text" name="owner_name" value={formData.owner_name} onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                name="address" value={formData.address} onChange={handleChange}
                className="w-full p-2 border rounded" rows="2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Globe className="mr-2" size={20} /> Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Language</label>
              <select 
                name="language_preference" value={formData.language_preference} onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <MessageCircle className="mr-2" size={20} /> Order Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input 
                type="checkbox" name="whatsapp_notifications_enabled" 
                id="whatsapp_notifications_enabled"
                checked={formData.whatsapp_notifications_enabled} 
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="whatsapp_notifications_enabled" className="ml-2 block text-sm text-gray-900 font-medium">
                Enable WhatsApp Order Summaries
              </label>
            </div>
            {formData.whatsapp_notifications_enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (with country code)</label>
                <input 
                  type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange}
                  placeholder="+919876543210"
                  className="w-full md:w-1/2 p-2 border rounded"
                />
                <p className="mt-1 text-xs text-gray-500">
                  New orders from the AI voice agent will be sent to this number.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-2 border-indigo-100">
          <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
            <CreditCard className="mr-2" size={20} /> Subscription
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-bold capitalize">{formData.subscription_tier} Plan</div>
              <div className="text-sm text-gray-500">Next billing on July 5, 2026</div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded font-medium">
              Upgrade to Pro
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-green-600 font-medium">
            {message && (
              <>
                <CheckCircle className="mr-2" size={20} /> {message}
              </>
            )}
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`bg-green-600 text-white px-6 py-2 rounded font-bold flex items-center shadow-lg hover:bg-green-700 transition-all ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save className="mr-2" size={20} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
