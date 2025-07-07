"use client";
import { ChatInterface } from "@/components/ChatInterface";
import { ConnectionForm } from "@/components/ConnectionForm";
import { QueryResults } from "@/components/QueryResult";
import { SchemaExplorer } from "@/components/SchemaExplorer";
import { useApp } from "@/contexts/Appcontext";
import { useState, useEffect } from "react";

const Page = () => {
  const { state, disconnect } = useApp();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"connect" | "schema" | "chat">(
    "connect"
  );
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = async()=>{
    try {
      await disconnect()
    } catch (error) {
      console.log(error);
      
    }
  }

  const tabs = [
    { id: "connect" as const, label: "Connect", icon: "🔌" },
    {
      id: "schema" as const,
      label: "Schema",
      icon: "📊",
      requiresConnection: true,
    },
    {
      id: "chat" as const,
      label: "Chat",
      icon: "💬",
      requiresConnection: true,
    },
  ];

  

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return null;
  }

  const isTabDisabled = (tab: (typeof tabs)[0]) => {
    return !!tab.requiresConnection && !state.isConnected;
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case "connect":
        return <ConnectionForm />;
      case "schema":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SchemaExplorer />
            <QueryResults />
          </div>
        );
      case "chat":
        return <ChatInterface />;
      default:
        return <ConnectionForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarExpanded ? 'w-64' : 'w-16'} bg-white shadow-lg border-r border-gray-200 sticky top-0 h-screen transition-all duration-300 ease-in-out`}>
        {/* Toggle Button */}
        <div className="p-2 border-b border-gray-200 flex justify-end">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-600">
              {sidebarExpanded ? '◀' : '▶'}
            </span>
          </button>
        </div>

        {sidebarExpanded && (
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Data Notebook</h1>
            <p className="text-sm text-gray-600 mt-1">Query & Explore</p>
          </div>
        )}

        <nav className="mt-6">
          {sidebarExpanded && (
            <div className="px-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h2>
            </div>
          )}

          <div className="space-y-1 px-2">
            {tabs.map((tab) => {
              const disabled = isTabDisabled(tab);
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => !disabled && setActiveTab(tab.id)}
                  disabled={disabled}
                  title={sidebarExpanded ? undefined : tab.label}
                  className={`
                    w-full flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'px-2 py-2 justify-center'} rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-800 border-r-2 border-blue-600"
                        : disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <span className={`${sidebarExpanded ? 'mr-3' : ''} text-base`}>{tab.icon}</span>
                  {sidebarExpanded && (
                    <>
                      {tab.label}
                      {disabled && (
                        <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                          Disabled
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Connection Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className={`flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center flex-col space-y-2'}`}>
            {state.isConnected && (
              <button 
                className={`bg-red-500 text-white ${sidebarExpanded ? 'px-4 py-2' : 'px-2 py-1'} rounded hover:bg-red-600 transition`} 
                onClick={()=>handleDisconnect()}
                title={sidebarExpanded ? undefined : "Disconnect"}
              >
                {sidebarExpanded ? 'Disconnect' : '🔌'}
              </button>
            )}
            <div className={`flex items-center ${sidebarExpanded ? 'space-x-2' : 'flex-col space-y-1'}`}>
              <div
                className={`w-2 h-2 rounded-full ${
                  state.isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {sidebarExpanded && (
                <span className="text-sm text-gray-600">
                  {state.isConnected ? "Connected" : "Not Connected"}
                </span>
              )}
            </div>
          </div>

          {sidebarExpanded && state.lastConnectedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Last connected: {state.lastConnectedAt.toLocaleTimeString()}
            </p>
          )}
          {sidebarExpanded && state.isQuerying && (
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Executing query...
            </p>
          )}
        </div>
      </aside>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {tabs.find((tab) => tab.id === activeTab)?.label} Settings
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600">
                {activeTab === "connect" &&
                  "Connect to your database to get started"}
                {activeTab === "schema" &&
                  "Explore your database structure and run queries"}
                {activeTab === "chat" &&
                  "Ask questions about your data in natural language"}
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
  );
};

export default Page;