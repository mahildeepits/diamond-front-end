import Banner from "../Pages/Banner";
import { Box, CardContent, Card, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import StarIcon from '@mui/icons-material/Star';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
export default function BookingDesk(){
    return (
        <>
            {/* Full-Width Banner */}
            <Banner name={"Booking Desk"}/>
            {/* Container for Cards */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    margin: "20px auto",
                    padding: 2,
                    maxWidth: "600px",
                }}
            >
                {/* Card 1 */}
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                            <Table sx={{ maxWidth: "600px" }} aria-label="simple table" border={1}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{textAlign:'center'}}>
                                            <Typography variant="h6">Mr. Amritpal Singh</Typography>
                                        </TableCell>
                                    </TableRow>
                                    {/* <TableRow>
                                        <TableCell><StarIcon /></TableCell>
                                        <TableCell sx={{minWidth:'105px'}} >Intercom : </TableCell>
                                        <TableCell>7523 / 7524 / 8989 / *653</TableCell>
                                    </TableRow> */}
                                    <TableRow>
                                        <TableCell><LocalPhoneIcon /></TableCell>
                                        <TableCell sx={{minWidth:'105px'}}>Add. : </TableCell>
                                        <TableCell>Green market, Shop no. 9, Gali no. 7, Talli Wala Bazar Chowk Area, Sultanwind road, Sarbar pura, Amritsar, Amritsar, Punjab, 143001</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><LocalPhoneIcon /></TableCell>
                                        <TableCell sx={{minWidth:'105px'}}>MOB : </TableCell>
                                        <TableCell>
                                            <p >+91 941-719-3330</p>
                                            <p >+91 781-462-1399</p>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><EmailIcon /></TableCell>
                                        <TableCell sx={{minWidth:'105px'}}>Email : </TableCell>
                                        <TableCell>anshjewellers41289@gmail.com</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}