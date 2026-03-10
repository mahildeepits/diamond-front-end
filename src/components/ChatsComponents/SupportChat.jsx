import { useState, useEffect, useRef } from "react"
import { Avatar, Box, Fab, IconButton, Paper, TextField, Typography, Zoom, Badge, styled } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CloseIcon from "@mui/icons-material/Close"
import SendIcon from "@mui/icons-material/Send"
import { useSelector } from "react-redux"
import {
  useFetchConversationsQuery,
  useAddCoversationsMutation,
  useFetchConversationMessagesQuery,
  useAddConversationMesssageMutation,
  useFetchAdminStatusQuery,
} from "../../store"
import { io } from "socket.io-client"
import noti from "../../assets/audio/notification.mp3"

// Styled components remain the same
const ChatButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}))

const ChatWindow = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(11),
  right: theme.spacing(4),
  width: 320,
  height: 450,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: 1000,
  boxShadow: theme.shadows[6],
  [theme.breakpoints.down("sm")]: {
    width: "90%",
    height: "70vh",
    bottom: theme.spacing(9),
    right: "5%",
  },
}))

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}))

const MessageArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}))

const MessageBubble = styled(Box)(({ theme, sent }) => ({
  maxWidth: "80%",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: sent ? theme.palette.primary.main : theme.palette.grey[200],
  color: sent ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: sent ? "flex-end" : "flex-start",
  borderBottomRightRadius: sent ? 0 : theme.spacing(2),
  borderBottomLeftRadius: sent ? theme.spacing(2) : 0,
}))

const MessageInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
}))

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [convoId, setConvoId] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const [status,setStatus] = useState(null); 
  const user = useSelector((state) => state.CurrentUser.user)

  const { data, isLoading, error } = useFetchConversationsQuery(
    { searchString: "", userId: user.id },
    { refetchOnMountOrArgChange: false },
  )

  const [addConvo, { isLoading: convo_loading, error: convo_error }] = useAddCoversationsMutation()
  const { data: adminStatus_data, isLoading: adminStatus_loading, error: adminStatus_error } = useFetchAdminStatusQuery();
  const {
    data: messageData,
    isLoading: messageData_loading,
    error: messsageData_error,
  } = useFetchConversationMessagesQuery(
    { conversationId: convoId },
    { refetchOnMountOrArgChange: false, skip: !convoId },
  )

  const [addMessage, { isLoading: message_loading, error: message_error }] = useAddConversationMesssageMutation()


  // Initialize conversation
  useEffect(() => {
    if (data?.data != undefined && data?.data?.id != undefined) {
      setConvoId(data?.data?.id)
    } else if ((data?.data != undefined || data?.data == null) && convoId == null) {
      createConversation()
    }
  }, [data, user, open])

  // Load messages when conversation changes
  useEffect(() => {
    if (messageData?.data != undefined && messageData?.data.length > 0) {
      setMessages(messageData?.data || [])

      // Schedule scroll to bottom after messages are loaded
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
    }
  }, [messageData])
  useEffect(() => {
    if(adminStatus_data?.data){
      setStatus(adminStatus_data?.data);
    }
  },[adminStatus_data])
  // Socket connection for real-time messaging
  useEffect(() => {
    // if (!socket || !convoId) return

    // Remove any existing listeners for previous conversations
    // socket.removeAllListeners()
    const socket = io(import.meta.env.VITE_LIVE_SERVER_URL);

    // Add listener for current conversation
    socket.on(`message.${convoId}`, ({ message }) => {
      if (message.user_id !== null) {
        // Only increment unread count if chat is closed
        if (!open && message.user_id !== user.id) {
          setUnreadCount((prev) => prev + 1)
          new Audio(noti).play();
        }
        // Update messages in a way that doesn't cause duplicates
        setMessages((prevMessages) => {
          // Remove any optimistic version of this message (temp messages)
          const filteredMessages = prevMessages.filter(
            (msg) =>
              // Keep all messages that aren't temporary or don't match this message's content
              !(
                msg.id.toString().startsWith("temp-") &&
                msg.message === message.message &&
                msg.user_id === message.user_id
              ),
          )

          // Check if the actual message already exists to prevent duplicates
          const messageExists = filteredMessages.some((msg) => msg.id === message.id)
          if (messageExists) {
            return filteredMessages
          }

          return [...filteredMessages, message]
        })

        // Schedule scroll to bottom after message is added
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
      }
    })
    socket.on('adminstatus',({status}) => {
      setStatus(status);
    });
    return () => {
      socket.removeAllListeners(`message.${convoId}`)
      socket.disconnect()
    }
  }, [socket, convoId, open, user.id])

  const toggleChat = () => {
    setOpen(!open)
    if (!open) {
      setUnreadCount(0)
      // Schedule scroll to bottom when opening chat
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
    }
  }

  const createConversation = async () => {
    const response = await addConvo({ user_id: user.id })
    if (response.data.status && response?.data?.data?.id != undefined) {
      if (convoId == null) {
        setConvoId(response?.data?.data?.id || null)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !convoId) return

    // Create message object
    const messageContent = newMessage.trim()
    const newMessageData = {
      user_id: user.id,
      message: messageContent,
      conversation_id: convoId,
    }

    // Add optimistic message to UI immediately with a clearly identifiable temporary ID
    const optimisticMessage = {
      ...newMessageData,
      id: `temp-${Date.now()}-${messageContent.substring(0, 10)}`,
      created_at: new Date().toISOString(),
    }

    // Add to messages immediately for better UX
    setMessages((prevMessages) => [...prevMessages, optimisticMessage])

    // Clear input immediately
    setNewMessage("")

    // Schedule scroll to bottom
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(scrollToBottom, 50)

    // Send message to server
    try {
      const res = await addMessage(newMessageData)
      // No need to do anything here, the socket will handle adding the real message
      // and replacing the temporary one
      if (res?.data?.status && convoId == null && res.data.data.id) {
        setConvoId(res.data.data.id)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (open && messages.length > 0) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
    }
  }, [messages, open])

  const formatTime = (date) => {
    if (date != undefined) {
      return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return "00:00"
  }

  return (
    <>
      <ChatButton color="primary" onClick={toggleChat} aria-label="support chat">
        <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
          <ChatIcon />
        </Badge>
      </ChatButton>

      <Zoom in={open}>
        <ChatWindow elevation={3}>
          <ChatHeader>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src="/placeholder.svg?height=40&width=40"
                alt="Support Admin"
                sx={{ mr: 1, bgcolor: "primary.dark" }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Support Chat
                </Typography>
                <Typography variant="caption">{ status || 'Online' }</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={toggleChat} sx={{ color: "primary.contrastText" }}>
              <CloseIcon />
            </IconButton>
          </ChatHeader>

          <MessageArea sx={{ display: "flex", flexDirection: "column" }}>
            {messages.length === 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  No messages yet. Start the conversation!
                </Typography>
              </Box>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  sent={msg.user_id === user.id}
                  sx={{ alignSelf: msg.user_id === user.id ? "flex-end" : "flex-start" }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      textAlign: "right",
                      opacity: 0.8,
                    }}
                  >
                    {formatTime(msg.created_at)}
                  </Typography>
                </MessageBubble>
              ))
            )}
            <div ref={messagesEndRef} />
          </MessageArea>

          <MessageInput>
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage()
              }}
            />
            <IconButton color="primary" onClick={handleSendMessage} disabled={!newMessage.trim()} sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>
          </MessageInput>
        </ChatWindow>
      </Zoom>
    </>
  )
}
