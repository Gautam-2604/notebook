"use client";
import { ChatInterface } from "@/components/ChatInterface";
import { ConnectionForm } from "@/components/ConnectionForm";
import { QueryResults } from "@/components/QueryResult";
import { SchemaExplorer } from "@/components/SchemaExplorer";
import { useApp } from "@/contexts/Appcontext";
import { useState } from "react";

const Page = () => {
  const { state, disconnect } = useApp();
  const [activeTab, setActiveTab] = useState<"connect" | "schema" | "chat">(
    "connect"
  );

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
              const disabled = isTabDisabled(tab);
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => !disabled && setActiveTab(tab.id)}
                  disabled={disabled}
                  className={`
                    w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-800 border-r-2 border-blue-600"
                        : disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
              );
            })}
          </div>
        </nav>

        {/* Connection Status */}

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            {state.isConnected && (
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={()=>handleDisconnect()}>
                Disconnect
              </button>
            )}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  state.isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {state.isConnected ? "Connected" : "Not Connected"}
              </span>
            </div>
          </div>

          {state.lastConnectedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Last connected: {state.lastConnectedAt.toLocaleTimeString()}
            </p>
          )}
          {state.isQuerying && (
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Executing query...
            </p>
          )}
        </div>
      </aside>

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
