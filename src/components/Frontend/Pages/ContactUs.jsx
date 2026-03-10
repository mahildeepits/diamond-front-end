import { Box, Button, Typography, Card, FormControl, InputLabel, InputAdornment, OutlinedInput, CardContent } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Banner from "./Banner";

export default function ContactUs(){
    return (
        <>
            
            <Banner name={'Contact Us'} />
            <Box sx={{
                display:{md:"flex",xs:"block"},
                background:"white",
                padding:"20px",
                // alignItems:"center"
                }}
                >
                <Box sx={{flex:"1",}}>
                    <Card variant="outlined">
                        <CardContent sx={{padding:"30px"}}>
                            <Typography sx={{my:2, fontWeight:"600"}} variant="h5">
                                Send Us A Message
                            </Typography>
                            <FormControl fullWidth sx={{my:2}} >
                                <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-name"
                                    label="name"
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{my:2}}>
                                <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email"
                                    label="email"
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{my:2}}>
                                <InputLabel htmlFor="outlined-adornment-phone">Phone</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-phone"
                                    label="phone"
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{my:2}}>
                                <InputLabel htmlFor="outlined-adornment-message">Message</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-message"
                                    label="message"
                                    rows={4}
                                    multiline
                                />
                            </FormControl>
                            <Button variant="contained" fullWidth>
                            Submit
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{flex:"1", padding:"20px 40px"}}>
                    <Typography
                    sx={{
                        padding:"30px 0",
                        fontWeight:"600",
                        color:"#000088",
                    }}
                    variant="h4"
                    >
                    CORPORATE HEADQUARTERS
                    </Typography>
                    <Box
                        sx={{
                            display:"block",
                        }}
                        >
                        <Box  sx={{ flex: 1 }}>
                            <Box display={"flex"}>
                            <LocationOnIcon sx={{mt:1.5}} />
                                <Typography sx={{
                                    flex:1,
                                    textDecoration:"bold",
                                    fontWeight:"500",
                                    padding:"10px"
                                }}
                                variant="h6"
                                >
                                Address
                                </Typography>
                            </Box>
                            <Typography sx={{fontSize:"14px", wordSpacing:"7px",lineHeight:"25px",ml:4}}>
                            Green market, Shop no. 9, Gali no. 7, Talli Wala Bazar Chowk Area, Sultanwind road, Sarbar pura, Amritsar, Amritsar, Punjab, 143001
                            </Typography>
                                
                        </Box>
                        <Box sx={{flex:1}}>
                            <Box sx={{display:"flex"}}>
                                <EmailIcon sx={{mt:1.5}} />
                                <Typography sx={{
                                        textDecoration:"bold",
                                    fontWeight:"500",
                                    padding:"10px"
                                }}
                                variant="h6"
                                >
                                    Email
                                </Typography>
                            </Box>
                            
                            <Typography sx={{fontSize:"14px", wordSpacing:"14px",lineHeight:"25px",ml:4}}>
                               Anshjewellers41289@gmail.com
                            </Typography>
                        </Box>
                        <Box  sx={{ flex: 1 }}>
                            <Box>
                                <Box sx={{display:"flex"}}>
                                <PhoneIcon  sx={{mt:1.5}} />
                                <Typography sx={{
                                    textDecoration:"bold",
                                    fontWeight:"500",
                                    padding:"10px"
                                }}
                                variant="h6"
                                >
                                    Phone
                                </Typography>
                                </Box>
                                <Box sx={{display:"flex",ml:4}}>
                                    <Box sx={{flex:"1" }}>
                                        <Typography sx={{fontSize:"14px",lineHeight:"25px"}}>
                                            <ArrowForwardIosIcon fontSize="14px" /> +91 9417193330
                                        </Typography>
                                        {/* <Typography sx={{fontSize:"14px",lineHeight:"25px"}}>
                                            <ArrowForwardIosIcon fontSize="14px" /> 9876543210
                                        </Typography> */}
                                    </Box>
                                    <Box sx={{flex:"1"}} >
                                        <Typography sx={{fontSize:"14px",lineHeight:"25px"}}>
                                            <ArrowForwardIosIcon fontSize="14px" /> +91 7814621399
                                        </Typography>
                                        {/* <Typography sx={{fontSize:"14px",lineHeight:"25px"}}>
                                            <ArrowForwardIosIcon fontSize="14px" /> 9876543210
                                        </Typography> */}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
                    
        </>
    );
}