/* eslint-disable react/prop-types */
import { LoadingButton } from "@mui/lab";
import { Box, Button, Paper, TextField, Typography, IconButton } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAddHomeTextUpdateMutation } from "../../store";
import useUserPermissions from "../../utils/useSubAdmin";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function HomepageTextComponent({ data, type = "header" }) {
  const { isSubAdmin } = useUserPermissions();
  const [addHomepageData, { isLoading }] = useAddHomeTextUpdateMutation();
  const [homepageText, setHomepageText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) {
      setBackgroundColor(data.background_color || "#FFFFFF");
      setTextColor(data.text_color || "#000000");
      setHomepageText(data.homepage_text || "");
    }
  }, [data]);

  const handleChange = (e) => {
    setHomepageText(e.target.value);
  };

  const handleChangeTextColor = (color) => {
    setTextColor(color);
  };

  const handleChangeBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  const clearHomepageText = async () => {
    const dataToSend = {
      text_color: "#000000",
      background_color: "#FFFFFF",
      homepage_text: "",
      type: type,
    };
    try {
      const res = await addHomepageData(dataToSend);
      if (res.data.code == 200) {
        setHomepageText("");
        toast.success("Homepage text cleared successfully");
      }
    } catch (error) {
      toast.error("Error while clearing text");
      console.log(error);
    }
  };

  const handleSaveUpdate = async () => {
    if (homepageText.trim().length <= 0) {
      toast.error("Please enter update text");
      setError(true);
    } else {
      const dataToSend = {
        text_color: textColor,
        background_color: backgroundColor,
        homepage_text: homepageText,
        type: type,
      };
      try {
        const res = await addHomepageData(dataToSend);
        if (res.data.code == 200) {
          toast.success("Details updated successfully");
        }
      } catch (error) {
        toast.error("Error while adding details");
        console.log("🚀 ~ handleSaveUpdate ~ error:", error);
      }
    }
  };

  const currentSavedText = data?.homepage_text || "";

  return (
    <Paper sx={{
      p: 3,
      borderRadius: "15px",
      bgcolor: "white",
      color: "black",
      "& .MuiTypography-root": { color: "black" },
      "& .MuiOutlinedInput-root": {
        background: "#f4f4f4",
        color: "black",
      },
      "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.7)" }
    }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Manage {type} Marquee</Typography>
      </Box>

      {/* Currently Active Text Box */}
      {currentSavedText ? (
        <Box sx={{
          p: 2,
          mb: 3,
          bgcolor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography sx={{ fontWeight: 500 }}>{currentSavedText}</Typography>
          <IconButton onClick={clearHomepageText} color="error" size="small">
            <DeleteForeverIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="textSecondary">No active text set. Displaying dummy preview below.</Typography>
        </Box>
      )}

      {/* Marquee Preview */}
      <Box sx={{ mt: 2, mb: 4, color: textColor }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Preview:</Typography>
        <marquee scrollamount="5">
          <span style={{
            backgroundColor: backgroundColor || "transparent",
            color: textColor || "#000",
            padding: '4px 10px',
            fontWeight: 'bold',
            borderRadius: '4px'
          }}>
            {homepageText || "Dummy Marquee Text Preview"}
          </span>
        </marquee>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { sm: "row", xs: "column" },
          gap: 2,
          mt: 2,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="subtitle2">Text Color</Typography>
          <MuiColorInput
            sx={{ width: "100%", "& .MuiInputBase-input": { color: 'black' } }}
            value={textColor}
            onChange={handleChangeTextColor}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography variant="subtitle2">Background Color</Typography>
          <MuiColorInput
            sx={{ width: "100%", "& .MuiInputBase-input": { color: 'black' } }}
            value={backgroundColor}
            onChange={handleChangeBackgroundColor}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 1 }}>
        <TextField
          disabled={isSubAdmin}
          name="update-text"
          onChange={handleChange}
          value={homepageText}
          margin="normal"
          label="New Marquee Text"
          placeholder="Type new text here...."
          error={error}
          helperText={error ? "Please enter text" : null}
          fullWidth
          sx={{ "& .MuiInputBase-input": { color: 'black' } }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <LoadingButton
          disabled={isSubAdmin}
          loading={isLoading}
          variant="contained"
          onClick={handleSaveUpdate}
          fullWidth
        >
          {currentSavedText ? "Update Text" : "Save and Start Marquee"}
        </LoadingButton>
      </Box>
    </Paper>
  );
}
