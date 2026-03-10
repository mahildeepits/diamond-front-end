import { useEffect, useState, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { io } from "socket.io-client";
import { Button } from "@mui/material"
import { Card, CardContent } from "@mui/material"
import { CoinsIcon as Coin } from "lucide-react"

// Configuration (you would replace these with your actual endpoints)
const SOCKET_SERVER_URL = import.meta.env.VITE_LIVE_SERVER_URL
const SOCKET_SERVER_API_URL = import.meta.env.VITE_API_KEY

const GetInitialCoinRates = "/coin-rates"

// API service mock (replace with your actual implementation)
const apiService = {
  getHomePageText: (section) => {
    return axios.get(`/homepage-text?section=${section}`)
  },
}

export default function Coins() {
  const [coinRates, setCoinRates] = useState([])
  const [priceColors, setPriceColors] = useState({})
  const [state, setState] = useState({
    topMarquee: { text: "", color: "", backgroundColor: "" },
  })

  // Fetch homepage text
  const { mutate: getHomePageTopText } = useMutation({
    mutationFn: () => apiService.getHomePageText("header"),
    onSuccess: (res) => {
      if (res?.data?.data) {
        setState((prev) => ({
          ...prev,
          topMarquee: {
            backgroundColor: res?.data?.data?.background_color || "transparent",
            text: res?.data?.data?.homepage_text || "",
            color: res?.data?.data?.text_color,
          },
        }))
      }
    },
  })

  // Fetch initial coin rates
  const { mutate: getInitialCoinRatesData } = useMutation({
    mutationFn: async () => await axios.get(SOCKET_SERVER_API_URL + GetInitialCoinRates),
    onSuccess: (res) => {
      setCoinRates(res.data)
    },
    onError: (err) => {
      console.log(err)
    },
  })

  // Initialize data on component mount
  useEffect(() => {
    getHomePageTopText()
    getInitialCoinRatesData()
  }, [])

  const prevRatesRef = useRef({})

  // Setup socket connection for real-time updates
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      timeout: 10000,
    })

    socket.on("coin-rates", (data) => {
      const newColors = {}

      data.coinRates.forEach((coin) => {
        const prevPrice = prevRatesRef.current[coin.id]
        if (prevPrice) {
          if (coin.amountWithtax > prevPrice) {
            newColors[coin.id] = "#4CAF50" // Green
          } else if (coin.amountWithtax < prevPrice) {
            newColors[coin.id] = "#FF5252" // Red
          }
        }
        // Update ref for next time
        prevRatesRef.current[coin.id] = coin.amountWithtax
      })

      setPriceColors(newColors)
      setCoinRates(data.coinRates)

      // Reset colors after 1 second
      setTimeout(() => {
        setPriceColors({})
      }, 1000)
    })

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, []) // Empty dependency means this runs once on mount

  // Format price with Indian Rupee
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-8 bg-primary text-white min-h-screen">
      <div className="pb-[160px]">
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-white text-3xl font-bold">Live Coin Rates</h1>
          <div className="bg-white/10 px-4 py-1 rounded-full text-sm backdrop-blur-sm border border-white/20">
            Real-time Updates
          </div>
        </div>

        {/* Ticker component */}
        <div
          className="p-2 overflow-hidden whitespace-nowrap mb-6 rounded-lg shadow-inner"
          style={{
            backgroundColor: state.topMarquee.backgroundColor || "rgba(255,255,255,0.1)",
            color: state.topMarquee.color || "white",
          }}
        >
          <div className="animate-marquee inline-block">{state.topMarquee.text}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coinRates.map((item) => (
            <Card key={item.id} className="bg-white hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden border-none">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="bg-gray-50 rounded-lg p-2 mr-4 flex-shrink-0 border border-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-contain"
                        onError={(e) => { e.target.src = "/images/gold-coin.png" }}
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-primary/5 rounded-lg">
                        <Coin className="w-10 h-10 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-gray-900 text-lg font-bold leading-tight mb-1">{item.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.metal_type === 'Silver' ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.metal_type || 'Gold'}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mb-2">{item.grams || item.qty} Grams</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-primary text-xl font-black">
                        {formatCurrency(item.amountWithtax)}
                      </div>
                      <Button
                        variant="outlined"
                        size="small"
                        className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors capitalize font-bold px-4"
                        style={{ borderColor: priceColors[item.id] || '' }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {coinRates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
            <Coin className="w-16 h-16 text-white/20 mb-4" />
            <p className="text-white/60 text-lg">No coins currently available</p>
          </div>
        )}
      </div>
    </div>
  )
}

