import { useEffect,useState } from "react"
import noti from "../../assets/audio/notification.mp3"
import { useSelector } from "react-redux"
import { Box, Paper, Typography } from "@mui/material"
import { io } from "socket.io-client"
import { useFetchConversationsQuery } from "../../store"
export const NotificationsComponent = () => {
    const [notifications, setNotifications] = useState([])
    const [conversations,setConversations] = useState([])
    const [socket, setSocket] = useState(null)
    const user = useSelector((state) => {
        return state.CurrentUser.user
      })
    const { data } = useFetchConversationsQuery(
        { searchString: null, userId: user.id },
    )
    useEffect(() => {
        if(data?.data){
            setConversations(data.data);
        }
    }, [data])
    useEffect(() => {
        const socket = io(import.meta.env.VITE_LIVE_SERVER_URL);
        const conversationIds = conversations.map((conversation) => conversation.id);
        conversationIds.forEach(convoId => {
            socket.on(`message.${convoId}`, ({ message }) => {
              if (message.user_id !== null) {
                new Audio(noti).play();
                // Update messages in a way that doesn't cause duplicates
                setNotifications((prev) => {
                    return [...prev, message];
                });
                console.log(message);
              }
            })
        })
        socket.on('conversation',({conversation}) => {
            if(conversation?.id){
                setConversations((prev) => {
                    // Check if conversation already exists
                    const exists = prev.some((c) => c.id === conversation.id)
            
                    if (exists) {
                      // Update existing conversation
                      return prev
                        .map((c) => (c.id === conversation.id ? { ...c, last_message: conversation.last_message } : c))// Sort to move the updated conversation to top
                    } else {
                      // Add new conversation
                      return [{ ...conversation }, ...prev];
                    }
                })
            }
        })
        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    },[socket,conversations])
    return (
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
            {notifications.map((notification) => {
              // In your NotificationToast component
              <Paper
              key={notification.id}
              elevation={3}
              sx={{
                  lineHeight:2.5,
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
                  { notification?.conversation?.name || '' }
                </Typography>
                <hr/>
                <Typography variant="body2" marginTop="2px">{ notification.message || '' }</Typography>
              </Paper>
            })}
          </Box>
        );
    }