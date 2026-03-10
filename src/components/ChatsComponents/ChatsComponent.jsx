import { useState, useEffect, useRef } from "react"
import { Avatar, Badge, Box, Container, IconButton, Paper, TextField, Typography, styled, CircularProgress, FormControlLabel, Switch } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SearchIcon from "@mui/icons-material/Search"
import SendIcon from "@mui/icons-material/Send"
import { UseMediaQuery } from "../../hooks/UseMediaQuery"
import {
  useFetchConversationsQuery,
  useFetchConversationMessagesQuery,
  useAddConversationMesssageMutation,
  useMarkReadConversationQuery,
  useChangeOnlineStatusMutation,
} from "../../store"
import { useSelector } from "react-redux"
import noti from "../../assets/audio/notification.mp3"
import { io } from "socket.io-client"
import { toast } from "react-toastify";

// Styled components remain the same
const ChatContainer = styled(Paper)(({ theme }) => ({
  height: "calc(100vh - 64px)", // Subtract navbar height
  display: "flex",
  overflow: "hidden",
  margin: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    margin: theme.spacing(1),
    height: "calc(100vh - 56px)", // Mobile navbar might be smaller
  },
}))

const ContactList = styled(Box)(({ theme, show, isMobileOrTablet }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  display: isMobileOrTablet && !show ? "none" : "block",
  width: isMobileOrTablet ? "100%" : "320px",
}))

const MessagePanel = styled(Box)(({ theme, show, isMobileOrTablet }) => ({
  flex: 1,
  flexDirection: "column",
  display: isMobileOrTablet && show ? "none" : "flex",
}))

const MessageBubble = styled(Box)(({ theme, sent }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: sent ? theme.palette.primary.main : theme.palette.grey[200],
  color: sent ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: sent ? "flex-end" : "flex-start",
  borderBottomRightRadius: sent ? 0 : theme.spacing(2),
  borderBottomLeftRadius: sent ? theme.spacing(2) : 0,
}))

const ContactItem = styled(Box)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  cursor: "pointer",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  backgroundColor: selected ? theme.palette.action.selected : "transparent",
}))

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
}))

const MessageArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto", // This enables scrolling
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  // Ensures the container takes up available space and scrolls internally
  height: "0px", // Important for flex scrolling
  // Optional: Custom scrollbar styling
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[400],
    borderRadius: "3px",
  },
}))

const MessageInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}))

// Helper function for sorting conversations by last message time
const sortConversations = (a, b) => {
  const dateA = a.last_message ? new Date(a.last_message.created_at) : new Date(0);
  const dateB = b.last_message ? new Date(b.last_message.created_at) : new Date(0);
  return dateB - dateA; // Newest first
};

export default function ChatComponent() {
  const isMobile = UseMediaQuery("(max-width: 768px)")
  const isTablet = UseMediaQuery("(max-width: 1024px)")
  const isMobileOrTablet = isMobile || isTablet
  const [notifications, setNotifications] = useState([])
  const [showChatList, setShowChatList] = useState(true)
  const [selectedConvo, setSelectedConvo] = useState(null)
  const [selectedConvoId, setSelectedConvoId] = useState(null)
  const [message, setMessage] = useState("")
  const [searchText, setSearchText] = useState("")
  const [conversations, setConversations] = useState([])
  const [convoMessages, setConvoMessages] = useState([])
  const [newConvoIds, setNewConvoIds] = useState([])
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(false);
  const messageAreaRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const [selectedConvoUserStatus, setSelectedConvoUserStatus] = useState(null);
  const user = useSelector((state) => state.CurrentUser.user)
  const [status, setStatus] = useState(user.is_offline ? "Offline" : "Online");

  const { data, refetch } = useFetchConversationsQuery(
    { searchString: searchText, userId: user.id },
  )

  const [addMessage] = useAddConversationMesssageMutation()
  const [changeStatus] = useChangeOnlineStatusMutation()

  const { data: messageData, isLoading: messageData_loading } = useFetchConversationMessagesQuery(
    { conversationId: selectedConvoId ?? null },
    {
      refetchOnMountOrArgChange: true,  // Force refetch on argument changes
      skip: !selectedConvoId,           // Don't fetch if no conversation selected
    }
  );
  const { data: convo_read, isLoading: convo_read_loading } = useMarkReadConversationQuery(
    { id: selectedConvoId },
    { skip: !selectedConvoId },
  )
  // Initialize newConvoIds from localStorage on component mount
  useEffect(() => {
    const storedIds = localStorage.getItem("conversation_ids")
    if (storedIds) {
      try {
        setNewConvoIds(JSON.parse(storedIds))
      } catch (e) {
        console.error("Error parsing stored conversation IDs", e)
        setNewConvoIds([])
      }
    }
  }, [])

  useEffect(() => {
    if (!isMobileOrTablet) setShowChatList(true)
  }, [isMobileOrTablet])

  useEffect(() => {
    if (data?.data) {
      // Convert to array if needed
      const rawData = data.data
      const conversationsArray = Array.isArray(rawData) ? [...rawData] : Object.values(rawData)
      console.log('working ', conversationsArray)
      // Sort conversations by last message time
      setConversations(conversationsArray.sort(sortConversations))
    } else {
      setConversations([]) // Default to empty array
    }
  }, [data]);
  useEffect(() => {
    if (convo_read?.data) {
      setConversations((prev) => {
        return prev
          .map((c) =>
            c.id === convo_read.data.id
              ? { ...c, read_at: convo_read.data.read_at } // Replace with latest data
              : c
          )
          .sort(sortConversations)
      })
    }
  }, [convo_read, selectedConvoId])

  useEffect(() => {
    if (messageData?.data) {
      setConvoMessages(messageData.data)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
    }
  }, [messageData, selectedConvoId])

  // Register socket listeners when conversations change
  useEffect(() => {
    const socket = io(import.meta.env.VITE_LIVE_SERVER_URL);

    // Add listener for current conversation
    const conversationIds = conversations.map((c) => c.id);
    conversationIds.forEach(convoId => {
      socket.on(`message.${convoId}`, ({ message }) => {

        if (message.user_id !== null) {
          // Update messages in a way that doesn't cause duplicates
          if (selectedConvoId != null && selectedConvoId === convoId) {
            setConvoMessages((prevMessages) => {
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

              return [...filteredMessages, message].sort(sortConversations)
            });
          }
          if (selectedConvoId == null || selectedConvoId !== convoId) {
            setNotifications((prev) => {
              return [...prev, message];
            });
            new Audio(noti).play();
          }
          setConversations((prev) => {
            const updated = prev.map(c =>
              c.id === convoId
                ? {
                  ...c,
                  last_message: message,
                  read_at: null
                }
                : c
            );

            return [...updated].sort(sortConversations);
          })

          // Schedule scroll to bottom after message is added
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
        }
      })
    })
    socket.on('conversation', ({ conversation }) => {
      setConversations((prev) => {
        // Check if conversation already exists
        const exists = prev.some((c) => c.id === conversation.id)

        if (exists) {
          // Update existing conversation
          return prev
            .map((c) => (c.id === conversation.id ? { ...c, last_message: conversation.last_message } : c))
            .sort(sortConversations) // Sort to move the updated conversation to top
        } else {
          // Add new conversation
          return [{ ...conversation }, ...prev].sort(sortConversations)
        }
      })
    })
    socket.on('conversationStatus', ({ status }) => {
      refetch();
    })
    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [socket, conversations, selectedConvoId, user.id, refetch])

  const handleConvoSelect = (convo) => {
    console.log("Selected convo", (selectedConvoId !== convo.id))
    if (selectedConvoId !== convo.id) {
      setSelectedConvo(convo)
      setSelectedConvoId(convo.id)
      setConvoMessages([])
    }
    const selectedConvoUser = convo.convo_users.filter((cu) => cu.id !== user.id);
    setSelectedConvoUserStatus(selectedConvoUser[0]?.offline_status || 'Online');
    // Remove from newConvoIds when selected (mark as read)
    if (newConvoIds.includes(convo.id)) {
      const updated = newConvoIds.filter((id) => id !== convo.id)
      localStorage.setItem("conversation_ids", JSON.stringify(updated))
      setNewConvoIds(updated)
    }
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
    if (isMobileOrTablet) setShowChatList(false)
  }

  const handleBackToList = () => {
    setShowChatList(true)
    setSelectedConvoId(null)
    setSelectedConvo(null)
    setConvoMessages([])
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConvoId) return

    const newMessage = {
      user_id: user.id,
      message: message.trim(),
      conversation_id: selectedConvoId,
    }

    const optimisticMessage = {
      ...newMessage,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    // Add message to conversation
    setConvoMessages((prev) => [...prev, optimisticMessage])

    // Update conversation with new last message and move to top
    setConversations((prev) => {
      return prev
        .map((c) => (c.id === selectedConvoId ? { ...c, last_message: optimisticMessage } : c))
        .sort(sortConversations) // Sort to move the updated conversation to top
    })

    setMessage("")

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(scrollToBottom, 50)

    try {
      await addMessage(newMessage)
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
    }
  }

  const formatTime = (date) => {
    return date ? new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00"
  }
  const handleChangeStatus = async () => {
    try {
      setLoading(true);
      const res = await changeStatus({ user_id: user.id })
      if (res?.data?.status) {
        toast.success(res.data.message);
        setStatus(res.data.is_offline ? 'Offline' : 'Online')
        localStorage.setItem('chat_status', res.data.is_offline ? 'Offline' : 'Online');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const chat_status = localStorage.getItem('chat_status') || null;
    if (chat_status) {
      setStatus(chat_status);
    }
  })

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3 }}>
        <Typography variant="h5" color="text.primary" sx={{ mt: 2 }}>Chats</Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ mx: 2 }} />
        ) : (
          <FormControlLabel
            control={
              <Switch
                checked={status == 'Online' ? true : false}
                onChange={handleChangeStatus}
                color="primary"
              />
            }
            label={status}
            labelPlacement="start"
          />
        )}
      </Box>
      <Container maxWidth={false} disableGutters>
        <ChatContainer elevation={3}>
          {/* Chat List */}
          <ContactList show={showChatList} isMobileOrTablet={isMobileOrTablet}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <TextField
                fullWidth
                placeholder="Search contacts"
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> }}
              />
            </Box>
            <Box sx={{ overflowY: "auto", height: "calc(90vh - 72px)" }}>
              {conversations
                .filter((c) => c?.last_message)
                .map((convo) => (
                  <ContactItem
                    key={convo.id}
                    selected={selectedConvo?.id === convo.id}
                    onClick={() => handleConvoSelect(convo)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ px: "2px" }}>
                        <Badge badgeContent={0} color="primary" overlap="circular" invisible={false}>
                          <Avatar src={convo.profile} alt={convo.name} />
                        </Badge>
                      </Box>
                      <Box sx={{ px: "10px", maxWidth: "80%", minWidth: "15%" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: (convo.read_at == null && convo.last_message != null && convo.last_message.user_id != user.id) ? 800 : 500 }}>
                          {convo.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            boxSizing: "border-box",
                            fontWeight: (convo.read_at == null && convo.last_message != null && convo.last_message.user_id != user.id) ? 800 : 400,
                          }}
                        >
                          {convo?.last_message?.message || ""}
                        </Typography>
                      </Box>
                    </Box>
                    {/* <Grid2 container spacing={2} alignItems="center">
                    <Grid2 item>
                      <Badge badgeContent={0} color="primary" overlap="circular" invisible={false}>
                        <Avatar src={convo.profile} alt={convo.name} />
                      </Badge>
                    </Grid2>
                    <Grid2 item xs>
                      <Typography variant="subtitle1" sx={{ fontWeight: (convo.read_at == null && convo.last_message != null && convo.last_message.user_id != user.id)? 800 : 500 }}>
                        {convo.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: (convo.read_at == null && convo.last_message != null && convo.last_message.user_id != user.id) ? 800 : 400,
                        }}
                      >
                        {convo?.last_message?.message || ""}
                      </Typography>
                    </Grid2>
                  </Grid2> */}
                  </ContactItem>
                ))}
            </Box>
          </ContactList>

          {/* Message Panel */}
          <MessagePanel show={showChatList} isMobileOrTablet={isMobileOrTablet}>
            {selectedConvo ? (
              <>
                <ChatHeader>
                  {isMobileOrTablet && (
                    <IconButton onClick={handleBackToList} sx={{ mr: 1 }}>
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <Avatar src={selectedConvo.profile} alt={selectedConvo.name} />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="subtitle1">{selectedConvo.name}</Typography>
                    <Typography variant="body2" sx={{ color: "success.main", fontSize: "0.875rem" }}>
                      {selectedConvoUserStatus}
                    </Typography>
                  </Box>
                </ChatHeader>

                <MessageArea ref={messageAreaRef}>
                  {messageData_loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                      <Typography variant="body2" color="text.secondary">
                        Loading messages...
                      </Typography>
                    </Box>
                  ) : convoMessages.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                      <Typography variant="body2" color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  ) : (
                    convoMessages.map((msg) => (
                      <MessageBubble key={msg.id} sent={msg.user_id === user.id}>
                        <Typography>{msg.message}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 0.5,
                            textAlign: "right",
                            color: msg.user_id === user.id ? "white" : "text.secondary",
                            opacity: 0.8,
                          }}
                        >
                          {formatTime(msg.created_at)}
                        </Typography>
                      </MessageBubble>
                    ))
                  )}
                </MessageArea>

                <MessageInput>
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <TextField
                      fullWidth
                      placeholder="Type a message"
                      variant="outlined"
                      size="small"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSendMessage()
                      }}
                    />
                    <IconButton color="primary" onClick={handleSendMessage} disabled={!message.trim()} sx={{ ml: 1 }}>
                      <SendIcon />
                    </IconButton>
                  </Box>
                </MessageInput>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Typography variant="h6" color="text.secondary">
                  Select a contact to start chatting
                </Typography>
              </Box>
            )}
          </MessagePanel>
        </ChatContainer>
      </Container>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxWidth: "100%",
          pointerEvents: "none", // Allow clicking through the container
        }}
      >
        {notifications.map((notification) => (
          // In your NotificationToast component
          <Paper
            key={notification.id}
            elevation={3}
            sx={{
              lineHeight: 2.5,
              textTransform: "capitalize",
              padding: 2,
              backgroundColor: "white",
              borderRadius: "4px",
              maxWidth: 300,
              marginLeft: "auto",
              transform: "translateX(100%)", // Initial hidden state
              animation: "slideIn 0.5s forwards, slideOut 0.5s forwards 4.5s",
              pointerEvents: "auto",
              overflow: "hidden",
              "@keyframes slideIn": {
                "to": { transform: "translateX(-6%)" },
              },
              "@keyframes slideOut": {
                "to": { transform: "translateX(100%)" },
              }
            }}
          >
            <Typography variant="subtitle2" fontWeight="800" lineHeight="1.0" color="primary.main" >
              {notification?.conversation?.name || ''}
            </Typography>
            <hr />
            <Typography variant="body2" marginTop="2px">{notification.message || ''}</Typography>
          </Paper>
        ))}
      </Box>
    </>
  )
}
