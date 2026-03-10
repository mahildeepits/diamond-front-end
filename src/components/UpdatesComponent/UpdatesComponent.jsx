/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAddBannerUpdateMutation } from "../../store";
import PhotoUploadComponent from "./PhotoUploadComponent";
import useUserPermissions from "../../utils/useSubAdmin";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
export default function UpdatesComponent({ data, isAdmin }) {
  const { isSubAdmin } = useUserPermissions();
  const [photo, setPhoto] = useState(null);
  const [updateText, setUpdateText] = useState("");
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    setUpdateText(e.target.value);
  };
  const [addBannerData, { isLoading }] = useAddBannerUpdateMutation();
  const handleSaveUpdate = async () => {
    const formData = new FormData();
    if (photo) {
      if (typeof photo !== 'string') {
        formData.append("image", photo);
      }
    } else {
      formData.append("remove_image", 1);
    }

    formData.append("text", updateText || "");

    try {
      const res = await addBannerData(formData);
      if (res.data.code == 200) {
        toast.success("Promo banner updated successfully");
      }
    } catch (error) {
      toast.error("Error while updating promo data");
      console.log("🚀 ~ handleSaveUpdate ~ error:", error);
    }
  };
  const updateBanner = async () => {
    const formData = new FormData();
    formData.append("remove_image", 1);
    formData.append("text", "");
    try {
      const res = await addBannerData(formData);
      if (res.data.code == 200) {
        setPhoto(null);
        setUpdateText("");
        toast.success("Promo banner cleared successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while clearing promo data");
    }
  };
  useEffect(() => {
    if (data) {
      setPhoto(data.image || null);
      setUpdateText(data.text || "");
    }
  }, [data]);
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
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>
          Add promo banner
        </Typography>
        {photo && <Button onClick={() => updateBanner()}><DeleteForeverIcon /></Button>}
      </Box>
      <Box>
        <PhotoUploadComponent
          disabled={isSubAdmin}
          photo={photo}
          setPhoto={setPhoto}
        />
      </Box>
      <Box>
        <TextField
          name="update-text"
          onChange={handleChange}
          value={updateText}
          margin="normal"
          label="Write update text"
          placeholder="Write your update here...."
          error={error}
          disabled={isSubAdmin}
          helperText={
            error ? (
              <Typography variant="caption" sx={{ color: "red" }}>
                Please enter update text
              </Typography>
            ) : null
          }
          fullWidth
          sx={{ color: 'black', "& .MuiInputBase-input": { color: 'black' } }}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <LoadingButton
          disabled={isSubAdmin}
          loading={isLoading}
          variant="contained"
          onClick={handleSaveUpdate}
        >
          Save
        </LoadingButton>
      </Box>
    </Paper>
  );
}
