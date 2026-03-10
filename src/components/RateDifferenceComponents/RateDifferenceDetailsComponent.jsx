/* eslint-disable react/prop-types */
import { Box, Paper, Typography } from "@mui/material";
export default function RateDifferenceDetailsComponent({ data }) {
  const {
    including_tcs,
    including_tds,
    next_including_tcs,
    next_including_tds,
  } = data;
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        bgcolor: "white",
        color: "black",
        "& .MuiTypography-root": { color: "black" }
      }}
    >
      {/* <Box>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Current rate difference
          <Typography variant="caption">(With TCS)</Typography>
        </Typography>
        <Typography variant="pageHeading">{including_tcs}</Typography>
      </Box> */}
      <Box>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Current rate GOLD difference
          {/* <Typography variant="caption">(With TDS)</Typography> */}
        </Typography>
        <Typography variant="pageHeading">{including_tds}</Typography>
      </Box>
      {/* <Box>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Next month rate difference
          <Typography variant="caption">(With TCS)</Typography>
        </Typography>
        <Typography variant="pageHeading">{next_including_tcs || 0}</Typography>
      </Box> */}
      {/* <Box>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Next month rate difference
          <Typography variant="caption">(With TDS)</Typography>
        </Typography>
        <Typography variant="pageHeading">{next_including_tds || 0}</Typography>
      </Box> */}
      <Box>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Current rate SILVER difference
          {/* <Typography variant="caption">(With TDS)</Typography> */}
        </Typography>
        <Typography variant="pageHeading">{data.including_silver_tds || 0}</Typography>
      </Box>
      {/* <Box>
        <Typography component={"div"} sx={{ mb: 1 }}>
          Next month rate difference for Silver
          <Typography variant="caption">(With TDS)</Typography>
        </Typography>
        <Typography variant="pageHeading">{data.next_month_silver_tds || 0}</Typography>
      </Box> */}
    </Paper>
  );
}
