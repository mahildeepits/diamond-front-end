import React from "react";
import { Card, CardContent, Typography, Grid2, IconButton, Box } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useFetchAdminContactDetailsQuery } from "../../store";
import { useEffect, useState } from "react";

export default function DashboardContactDetails(){
  const { data, isLoading, error } = useFetchAdminContactDetailsQuery();
  const [contactDetails, setContactDetails] = useState({});
    useEffect(() => {
      if (data) {
        if (data.code == 200) {
          setContactDetails(data.data);
        }
      }
    }, [data, error]);
  return (
    <Card sx={{padding: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contact Details
        </Typography>
        <Grid2 sx={{display:'flex'}} justifyContent={"space-around"}>
            <Box item width={'50%'}>
                <Grid2 sx={{display:'flex',alignItems:'center'}}>
                    <IconButton sx={{borderRadius:'0px',":hover":{bgcolor:'transparent'}}}>
                        <AccountCircleIcon color="primary" />
                        <Typography variant="body1" sx={{mt:0.5, px:2}}>Contact No.  </Typography>
                    </IconButton>
                    <Typography variant="body1" >{contactDetails?.first_contact_number + ',' || ''} {contactDetails?.second_contact_number || ''}</Typography>
                </Grid2>
                <Grid2 sx={{display:'flex',alignItems:'center'}}>
                    <IconButton sx={{borderRadius:'0px',":hover":{bgcolor:'transparent'}}}>
                        <PhoneIcon color="primary" />
                        <Typography variant="body1" sx={{mt:0.5, px:2}}>Booking No.  </Typography>
                    </IconButton>
                    <Typography variant="body1" >{contactDetails?.first_booking_number + ',' || ''} {contactDetails?.second_booking_number || ''}</Typography>
                </Grid2>
                <Grid2 sx={{display:'flex',alignItems:'center'}}>
                    <IconButton sx={{borderRadius:'0px',":hover":{bgcolor:'transparent'}}}>
                    <EmailIcon color="primary" />
                    <Typography variant="body1" sx={{mt:0.5, px:2}}>Email  </Typography>
                    </IconButton>
                    <Typography variant="body1">{contactDetails?.email || ''}</Typography>
                </Grid2>
            </Box>
            <Box item width={'50%'}>
                <Grid2 sx={{display:'flex',alignItems:'start'}}>
                    <IconButton sx={{borderRadius:'0px',":hover":{bgcolor:'transparent'}}}>
                        <HomeIcon color="primary" />
                        <Typography variant="body1" sx={{mt:0.5, px:2}}>Address  </Typography>
                    </IconButton>
                    <Typography variant="body1" sx={{mt:1.5, px:2}}>{contactDetails?.address || ''}</Typography>
                </Grid2>
            </Box>
        </Grid2>
      </CardContent>
    </Card>
  );
};
