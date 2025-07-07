"use client";
import { ChatInterface } from "@/components/chat/ChatWindow";
import { ConnectionForm } from "@/components/connect/ConnectorForm";
import { QueryResults } from "@/components/output/QueryOutput";
import { SchemaExplorer } from "@/components/schema/SchemaExplorer";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= 1024) {
        setMobileMenuOpen(false);
        setSidebarExpanded(true);
      }
      else if (width >= 768 && width < 1024) {
        setSidebarExpanded(false);
      }
      else if (width < 768) {
        setSidebarExpanded(false);
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!mounted) {
    return null;
  }

  const isTabDisabled = (tab: (typeof tabs)[0]) => {
    return !!tab.requiresConnection && !state.isConnected;
  };

  const handleTabClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false); 
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case "connect":
        return <ConnectionForm />;
      case "schema":
        return (
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
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
    <div className="min-h-screen bg-gray-50 lg:bg-gray-100 flex relative">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
        aria-label="Toggle mobile menu"
      >
        <span className="text-gray-700 font-medium text-sm">
          {mobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        ${sidebarExpanded ? 'w-64 sm:w-72' : 'w-16 sm:w-18'} 
        bg-white shadow-lg border-r border-gray-200 
        transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:sticky top-0 h-screen z-40
        flex flex-col
      `}>
        <div className="p-2 sm:p-3 border-b border-gray-200 justify-end hidden lg:flex">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <span className="text-gray-600 text-sm">
              {sidebarExpanded ? '◀' : '▶'}
            </span>
          </button>
        </div>

   
        <div className={`p-4 sm:p-5 lg:p-6 border-b border-gray-200 ${!sidebarExpanded && 'hidden lg:block'}`}>
         
            {sidebarExpanded && (
               <h1 className={`font-bold text-gray-800 text-xl sm:text-2xl`}>
              Data Notebook
              </h1>
            )}
            
          
          {sidebarExpanded && (
            <p className="text-sm text-gray-600 mt-1">Query & Explore</p>
          )}
        </div>

        <nav className="mt-2 sm:mt-4 lg:mt-6 flex-1 overflow-y-auto">
          {sidebarExpanded && (
            <div className="px-4 sm:px-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h2>
            </div>
          )}

          <div className="space-y-1 px-2 sm:px-3">
            {tabs.map((tab) => {
              const disabled = isTabDisabled(tab);
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => !disabled && handleTabClick(tab.id)}
                  disabled={disabled}
                  title={sidebarExpanded ? undefined : tab.label}
                  className={`
                    w-full flex items-center 
                    ${sidebarExpanded ? 'px-3 sm:px-4 py-2.5 sm:py-3' : 'px-2 py-2.5 justify-center'} 
                    rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-800 border-r-2 border-blue-600"
                        : disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <span className={`${sidebarExpanded ? 'mr-3' : ''} text-base sm:text-lg`}>{tab.icon}</span>
                  {sidebarExpanded && (
                    <>
                      <span className="text-sm sm:text-base">{tab.label}</span>
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

        <div className="p-3 sm:p-4 lg:p-5 border-t border-gray-200 bg-white">
          <div className={`flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center flex-col space-y-2'}`}>
            {state.isConnected && (
              <button 
                className={`bg-red-500 text-white ${sidebarExpanded ? 'px-3 py-2 text-sm' : 'px-2 py-1.5 text-xs'} rounded-lg hover:bg-red-600 transition-colors font-medium`} 
                onClick={()=>handleDisconnect()}
                title={sidebarExpanded ? undefined : "Disconnect"}
              >
                {sidebarExpanded ? 'Disconnect' : '🔌'}
              </button>
            )}
            <div className={`flex items-center ${sidebarExpanded ? 'space-x-2' : 'flex-col space-y-1'}`}>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
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
            <p className="text-xs text-gray-500 mt-2">
              Last connected: {state.lastConnectedAt.toLocaleTimeString()}
            </p>
          )}
          {sidebarExpanded && state.isQuerying && (
            <p className="text-xs text-blue-600 mt-2 flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Executing query...
            </p>
          )}
        </div>
      </aside>


      <main className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
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