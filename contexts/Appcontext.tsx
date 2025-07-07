
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

export interface ConnectionConfig {
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  connectionString?: string
  type?: 'postgresql' | 'mysql' 
}

export interface AppState {
  isConnected: boolean
  connectionConfig: ConnectionConfig | null
  isConnecting: boolean
  error: string | null
  lastConnectedAt: Date | null
}

export type AppAction =
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; payload: ConnectionConfig }
  | { type: 'CONNECT_FAILURE'; payload: string }
  | { type: 'DISCONNECT' }
  | { type: 'CLEAR_ERROR' }

// Initial state
const initialState: AppState = {
  isConnected: false,
  connectionConfig: null,
  isConnecting: false,
  error: null,
  lastConnectedAt: null
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CONNECT_START':
      return {
        ...state,
        isConnecting: true,
        error: null
      }
    
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        connectionConfig: action.payload,
        error: null,
        lastConnectedAt: new Date()
      }
    
    case 'CONNECT_FAILURE':
      return {
        ...state,
        isConnected: false,
        isConnecting: false,
        error: action.payload,
        connectionConfig: null
      }
    
    case 'DISCONNECT':
      return {
        ...state,
        isConnected: false,
        connectionConfig: null,
        error: null,
        lastConnectedAt: null
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Context
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Helper functions
  connect: (config: ConnectionConfig) => Promise<void>
  disconnect: () => void
  clearError: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Simulate connection logic
  const connect = async (config: ConnectionConfig) => {
    dispatch({ type: 'CONNECT_START' })
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate connection validation
      if (!config.connectionString && (!config.host || !config.database)) {
        throw new Error('Invalid connection configuration')
      }
      
      // Simulate random connection failure for demo
      if (Math.random() < 0.1) {
        throw new Error('Connection timeout - please check your credentials')
      }
      
      dispatch({ type: 'CONNECT_SUCCESS', payload: config })
    } catch (error) {
      dispatch({ 
        type: 'CONNECT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Connection failed'
      })
    }
  }

  const disconnect = () => {
    dispatch({ type: 'DISCONNECT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AppContextType = {
    state,
    dispatch,
    connect,
    disconnect,
    clearError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Additional hooks for specific use cases
export function useConnection() {
  const { state, connect, disconnect } = useApp()
  return {
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    connectionConfig: state.connectionConfig,
    lastConnectedAt: state.lastConnectedAt,
    connect,
    disconnect
  }
}

export function useConnectionError() {
  const { state, clearError } = useApp()
  return {
    error: state.error,
    clearError
  }
}