import { useState, useEffect } from "react";
import Banner from "../Pages/Banner";
import { Box, CardContent, Card, Typography } from "@mui/material";
import { useFetchBankDetailsQuery } from "../../../store";
import BankDetailsComponent from "../../BankDetailsComponents/BankDetailsComponent";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
export default function BankDetails(){
    const [bankDetails, setBankDetails] = useState([]);
    const { data, isLoading, error } = useFetchBankDetailsQuery();
    useEffect(() => {
        if (data) {
          if (data.code == 200) {
            setBankDetails(data.data);
            console.log(bankDetails);
          } else if (error) {
            toast.error("Error while fetching bank details");
          }
        }
      }, [data, error, bankDetails]);
    return (
        <>
            {/* Full-Width Banner */}
            <Banner name={"Bank Details"}/>
            {/* Container for Cards */}
            <Card>
              <CardContent>
                <Box sx={{
                    display:"flex",
                    justifyContent:"center",
                    py:4,
                  }}>
                  { bankDetails.length === 0 ? (
                    <Typography variant="h6" color="textSecondary">
                      No Bank Details Found
                    </Typography>
                  ) : ( bankDetails.map((bank) => (
                      <Table key={bank.account_number} sx={{ maxWidth: "600px",flex:1 }} aria-label="simple table" border={1}>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} sx={{textAlign:'center'}}>
                                    <Typography variant="h6">{bank.bank_name}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{minWidth:'105px'}} >Account Holder : </TableCell>
                                <TableCell>{bank.account_holder_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Acc. no. : </TableCell>
                                <TableCell>{bank.account_number}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Branch : </TableCell>
                                <TableCell>{bank.branch_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>IFSC : </TableCell>
                                <TableCell>{bank.ifsc_code}</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>
        </>
    );
}