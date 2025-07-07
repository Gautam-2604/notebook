'use client'
import { useApp } from "@/contexts/Appcontext";
import { useState, useEffect } from "react";
import {toast} from 'sonner'

const STORAGE_KEY = 'db_connection_config';

export function ConnectionForm() {
  const { state, connect, clearError, disconnect } = useApp();
  const [formData, setFormData] = useState({
    type: 'postgresql' as 'postgresql' | 'mysql',
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: ''
  });

  // Load saved connection config on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          // Don't restore password for security
          password: ''
        }));
      } catch (error) {
        console.error('Error loading saved connection config:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveConnectionConfig = (config: typeof formData) => {
    try {
      // Save config without password for security
      const configToSave = {
        ...config,
        password: '' // Don't save password
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
    } catch (error) {
      console.error('Error saving connection config:', error);
    }
  };

  const clearSavedConfig = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const connectPromise = connect(formData).then(() => {
      // Save config to localStorage on successful connection
      saveConnectionConfig(formData);
    });

    toast.promise(connectPromise, {
      loading: 'Connecting...',
      success: 'Connected successfully!',
      error: 'Connection failed. Please try again.',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || 5432 : value
    }));
  };

  const handleDisconnect = () => {
    disconnect();
    // Optionally clear saved config on disconnect
    // clearSavedConfig();
  };

  const handleClearSavedConfig = () => {
    clearSavedConfig();
    setFormData({
      type: 'postgresql',
      host: 'localhost',
      port: 5432,
      database: '',
      username: '',
      password: ''
    });
    toast.success('Saved connection config cleared');
  };

  if (state.isConnected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Database Connection</h2>
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div>
              <p className="text-green-800 font-medium">Connected Successfully</p>
              <p className="text-green-600 text-sm">
                {state.connectionConfig?.type}://{state.connectionConfig?.host}:{state.connectionConfig?.port}/{state.connectionConfig?.database}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleDisconnect}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
          <button 
            onClick={handleClearSavedConfig}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear Saved Config
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Database Connection</h2>
      
      {state.error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <p className="text-red-800 font-medium">Connection Failed</p>
            </div>
            <button 
              onClick={clearError}
              className="text-red-600 hover:text-red-700"
            >
              ✕
            </button>
          </div>
          <p className="text-red-600 text-sm mt-2">{state.error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Database Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={state.isConnecting}
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Host
            </label>
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              disabled={state.isConnecting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port
            </label>
            <input
              type="number"
              name="port"
              value={formData.port}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              disabled={state.isConnecting}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Database Name *
          </label>
          <input
            type="text"
            name="database"
            value={formData.database}
            onChange={handleChange}
            placeholder="my_database"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={state.isConnecting}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={state.isConnecting}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={state.isConnecting}
            required
          />
        </div>
        
        <button 
          type="submit"
          disabled={state.isConnecting || !formData.database || !formData.username}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {state.isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </button>
        
        {localStorage.getItem(STORAGE_KEY) && (
          <button 
            type="button"
            onClick={handleClearSavedConfig}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm"
          >
            Clear Saved Configuration
          </button>
        )}
      </form>
    </div>
  );
}