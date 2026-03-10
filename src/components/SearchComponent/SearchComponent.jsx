/* eslint-disable react/prop-types */
import { Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";

export default function SearchComponent({ handleChange, searchValue = "" }) {
  return (
    <>
      <Box sx={{ width: "100%", mb: 2 }}>
        <TextField
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: "5px",
            "& .MuiOutlinedInput-root": { borderRadius: "5px" },
            "& .MuiInputBase-input": { color: "black", fontSize: "14px" }
          }}
          placeholder="Search by name or phone"
          fullWidth
        />
      </Box>
    </>
  );
}
