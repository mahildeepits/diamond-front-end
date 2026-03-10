"use client"

import { Box, Typography, Card, CardContent, Button, Grid2, CardMedia,  Dialog, DialogContent } from "@mui/material"
import Coin from "../../../assets/images/coin.png"
import { useFetchGoldCoinRatesQuery } from "../../../store/apis/UpdatesAPI"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function Products() {
  const [priceColors, setPriceColors] = useState({})
  const [coinRates, setCoinRates] = useState([])
  const { data, isLoading, error } = useFetchGoldCoinRatesQuery()
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  useEffect(() => {
    if (data) {
      setCoinRates(data.data)
      console.warn('thetyghcdvhjd',data)
    }
  }, [data])

  useEffect(() => {
    const socket = io(import.meta.env.VITE_LIVE_SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      timeout: 10000,
    })

    socket.on("coin-rates", (data) => {
      const prevRates = coinRates.reduce((acc, coin) => {
        acc[coin.id] = coin.amountWithtax
        return acc
      }, {})

      const newColors = {}
      data.coinRates.forEach((coin) => {
        if (prevRates[coin.id]) {
          newColors[coin.id] =
            coin.amountWithtax > prevRates[coin.id]
              ? "#4CAF50"
              : coin.amountWithtax < prevRates[coin.id]
                ? "#FF5252"
                : "#1e40af"
        }
      })

      setPriceColors(newColors)
      setCoinRates(data.coinRates)

      setTimeout(() => {
        setPriceColors({})
      }, 1000)
    })

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [coinRates])

  const finalPrice = (amount, qty) => {
   if(amount && qty){
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format((amount / 10) * qty)
   }
   return 'N/A';
  }
  const handleOpenDialog = (image) => {
    setSelectedImage(image)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedImage(null)
  }
  return (
    <Box sx={{ pb: 3 }}>
      <Typography
        variant="h4"
        sx={{
          position: "relative",
          textAlign: "center",
          fontWeight: 700,
          color: "black",
          my: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "10%",
            bottom: "0%",
            left: "45%",
            borderBottom: "2px solid black",
          },
        }}
      >
        Products
      </Typography>
      <Card>
        <CardContent  sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {coinRates.map((item) => (
            <Grid2 container key={item.id} spacing={2} justifyContent={"space-between"} alignItems="center" sx={{ mb: 2 }}>
              <Grid2>
                <Box display="flex" alignItems="center" >
                    <CardMedia
                    component="img"
                    image={Coin}
                    alt={item.title}
                    sx={{ width: 50, height: 50, objectFit: "contain" }}
                    />
                    <Typography variant="h6" sx={{px:2}}>{item.title}</Typography>
                </Box>
              </Grid2>
              <Grid2>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: priceColors[item.id] || "#1e40af",
                      color: "white",
                      mr: 1,
                      "&:hover": {
                        backgroundColor: priceColors[item.id] || "#1e40af",
                      },
                    }}
                  >
                    {finalPrice(item.amountWithtax, item.qty)}
                  </Button>
                  <Button variant="outlined" onClick={() => handleOpenDialog(item.image)}>View</Button>
                </Box>
              </Grid2>
            </Grid2>
          ))}
        </CardContent>
      </Card>
      {/* Image Popup Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <CardMedia component="img" image={selectedImage} alt="Selected Coin" sx={{ width: "100%", height: "auto" }} />
      </Dialog>
    </Box>
  )
}

