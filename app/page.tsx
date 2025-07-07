'use client'

import { useState } from 'react'
import { useConnection, useConnectionError } from '../contexts/Appcontext'

type TabType = 'connect' | 'schema' | 'chat'

interface TabConfig {
  id: TabType
  label: string
  icon: string
  requiresConnection?: boolean
}

const tabs: TabConfig[] = [
  { id: 'connect', label: 'Connect', icon: '🔌' },
  { id: 'schema', label: 'Schema', icon: '📊', requiresConnection: true },
  { id: 'chat', label: 'Chat', icon: '💬', requiresConnection: true }
]

// Placeholder components
const ConnectForm = () => {
  const { connect, disconnect, isConnected, isConnecting, connectionConfig } = useConnection()
  const { error, clearError } = useConnectionError()
  const [connectionString, setConnectionString] = useState('')

  const handleConnect = async () => {
    if (!connectionString.trim()) return
    
    clearError()
    await connect({
      connectionString: connectionString.trim(),
      type: 'postgresql'
    })
  }

  const handleDisconnect = () => {
    disconnect()
    setConnectionString('')
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Database Connection</h2>
      
      {isConnected ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-green-800 font-medium">Connected Successfully</p>
                <p className="text-green-600 text-sm">
                  {connectionConfig?.connectionString || 'Database connection established'}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleDisconnect}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
              <p className="text-red-600 text-sm mt-2">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection String
            </label>
            <input
              type="text"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder="postgresql://username:password@localhost:5432/database"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isConnecting}
            />
          </div>
          
          <button 
            onClick={handleConnect}
            disabled={isConnecting || !connectionString.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

const SchemaExplorer = () => (
  <div className="p-6 bg-white rounded-lg shadow-sm border">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Schema Explorer</h2>
    <div className="text-gray-600">
      <p className="mb-4">Explore your database schema, tables, and relationships.</p>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="font-mono text-sm">
          <div className="text-blue-600">📋 Tables</div>
          <div className="ml-4 text-gray-700">• users</div>
          <div className="ml-4 text-gray-700">• products</div>
          <div className="ml-4 text-gray-700">• orders</div>
        </div>
      </div>
    </div>
  </div>
)

const ChatUI = () => (
  <div className="p-6 bg-white rounded-lg shadow-sm border h-full flex flex-col">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">SQL Chat</h2>
    <div className="flex-1 bg-gray-50 rounded-md p-4 mb-4 min-h-[400px]">
      <div className="text-gray-600 text-center mt-20">
        <div className="text-4xl mb-4">💬</div>
        <p>Ask questions about your data in natural language</p>
      </div>
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Ask a question about your data..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Send
      </button>
    </div>
  </div>
)

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('connect')
  const { isConnected, lastConnectedAt } = useConnection()

  const isTabDisabled = (tab: TabConfig): boolean => {
    return !!tab.requiresConnection && !isConnected
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'connect':
        return <ConnectForm />
      case 'schema':
        return <SchemaExplorer />
      case 'chat':
        return <ChatUI />
      default:
        return <ConnectForm />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Data Notebook</h1>
          <p className="text-sm text-gray-600 mt-1">Query & Explore</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h2>
          </div>
          
          <div className="space-y-1 px-2">
            {tabs.map((tab) => {
              const disabled = isTabDisabled(tab)
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !disabled && setActiveTab(tab.id)}
                  disabled={disabled}
                  className={`
                    w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-100 text-blue-800 border-r-2 border-blue-600' 
                      : disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3 text-base">{tab.icon}</span>
                  {tab.label}
                  {disabled && (
                    <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                      Disabled
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>
        
        {/* Connection Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          {lastConnectedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Last connected: {lastConnectedAt.toLocaleTimeString()}
            </p>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'connect' && 'Connect to your database to get started'}
                {activeTab === 'schema' && 'Explore your database structure and relationships'}
                {activeTab === 'chat' && 'Ask questions about your data in natural language'}
              </p>
            </div>

            {/* Dynamic Content */}
            <div className="transition-all duration-300 ease-in-out">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}