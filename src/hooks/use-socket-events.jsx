import { useEffect } from "react"
import { useSocket } from "../contexts/socket-context"

// Custom hook to handle socket events for a specific conversation
export const useSocketEvents = (conversationId, onMessage) => {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket || !conversationId) return

    // Set up event listener for this specific conversation
    const eventName = `message.${conversationId}`

    const handleMessage = ({ message }) => {
      console.log(`Message received in hook for conversation ${conversationId}:`, message)
      onMessage(message)
    }

    // Register the event listener
    socket.on(eventName, handleMessage)

    // Cleanup function to remove the event listener
    return () => {
      socket.off(eventName, handleMessage)
    }
  }, [socket, conversationId, onMessage])
}