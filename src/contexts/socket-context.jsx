"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import noti from "../assets/audio/notification.mp3"
// Create the context with a default value
const SocketContext = createContext({
  socket: null,
  isConnected: false,
  registerConversationListeners: () => {},
  registerNewConversationListener: () => {},
})

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(import.meta.env.VITE_LIVE_SERVER_URL)

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up socket connection")
      socketInstance.removeAllListeners()
      socketInstance.disconnect()
    }
  }, [])

  // Function to register message listeners for multiple conversations
  const registerConversationListeners = (conversationIds, onMessage) => {
    if (!socket) return

    // Remove any existing listeners first
    conversationIds.forEach((id) => {
      socket.off(`message.${id}`)
    })

    // Register new listeners
    conversationIds.forEach((id) => {
      socket.on(`message.${id}`, ({ message }) => {
        console.log(`Message received for conversation ${id}:`, message)
        onMessage(id, message)
      })
    })
  }

  // Function to register listener for new conversations
  const registerNewConversationListener = (onNewConversation) => {
    if (!socket) return

    socket.off("conversation")
    socket.on("conversation", ({ conversation }) => {
      console.log("New conversation received:", conversation)
      onNewConversation(conversation)
    })
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        registerConversationListeners,
        registerNewConversationListener,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
