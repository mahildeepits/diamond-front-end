/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import RateDifferenceFormComponent from "./RateDifferenceFormComponent";
import RateDifferenceDetailsComponent from "./RateDifferenceDetailsComponent";
export default function RateDifferenceComponent({ data }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        gap: "10px",
        flexDirection: {
          md: "row",
          sm: "column-reverse",
          xs: "column-reverse",
        },
      }}
    >
      <Box sx={{ width: { md: "70%", sm: "100%", xs: "100%" } }}>
        <RateDifferenceFormComponent data={data} />
      </Box>
      <Box sx={{ width: { md: "30%", sm: "100%", xs: "100%" } }}>
        <RateDifferenceDetailsComponent data={data} />
      </Box>
    </Box>
  );
}
