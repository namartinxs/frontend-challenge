import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'

import { env } from '@core/config/env'
import { getSessionToken } from '@core/storage/session-storage'

interface SocketContextValue {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextValue | null>(null)

interface SocketProviderProps {
  /** Only connect once there is an authenticated session (README §"Tempo real"). */
  enabled: boolean
  children: ReactNode
}

/**
 * Owns the single socket.io-client connection for the whole app. Modules
 * never call `io()` themselves — they read the socket through `useSocket`
 * and register/unregister their own listeners in an effect, so listeners
 * are always released when a feature's lifecycle ends (README §"Tempo real").
 */
export function SocketProvider({ enabled, children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)

  const socket = useMemo(() => {
    if (!enabled) return null
    return io(env.VITE_SOCKET_URL || window.location.origin, {
      autoConnect: false,
      auth: (callback) => callback({ token: getSessionToken() }),
    })
  }, [enabled])

  useEffect(() => {
    if (!socket) return

    socket.connect()
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.disconnect()
    }
  }, [socket])

  const value = useMemo<SocketContextValue>(() => ({ socket, isConnected }), [socket, isConnected])

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
