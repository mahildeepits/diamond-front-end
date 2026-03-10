/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { Delete, PhotoOutlined } from "@mui/icons-material";
import { Box, Button, Typography, IconButton } from "@mui/material";

export default function PhotoUploadComponent({ photo, setPhoto, disabled }) {
  const inputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState("");
  const handlePhotoDrag = (event) => {
    event.preventDefault();
    const photoInput = event.target.files[0];
    if (!photoInput) {
      toast.error("Please select a file.");
    } else if (photoInput.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2 MB.");
    } else {
      setPhoto(photoInput);
      const preview = URL.createObjectURL(photoInput);
      setPreviewUrl(preview);
    }
  };
  useEffect(() => {
    if (photo && !previewUrl) {
      setPreviewUrl(photo);
    } else if (!photo) {
      setPreviewUrl("");
    }
  }, [photo, previewUrl]);
  const handleClearImage = () => {
    setPreviewUrl("");
    setPhoto(null);
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {previewUrl ? (
        <>
          <Box sx={{ position: "relative" }}>
            {/* <IconButton
              onClick={handleClearImage}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "red",
                backgroundColor: "white",
              }}
              disabled={disabled}
            >
              <Delete />
            </IconButton> */}
            <Box
              sx={{
                width: { sm: "400px", xs: "200px" },
                height: { sm: "400px", xs: "200px" },
              }}
            >
              <img
                src={previewUrl}
                alt="uploaded-image"
                height={"100%"}
                width="100%"
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            p: 5,
            width: "400px",
            border: "3px dashed",
            borderColor: "primary.main",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <form className="mb-2 text-center" encType="multipart/form-data">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handlePhotoDrag}
              hidden
              ref={inputRef}
            />
            <PhotoOutlined
              sx={{
                color: "#aeaeae",
                fontSize: { md: "100px", sm: "80px", xs: "60px" },
              }}
            />
            <Typography
              sx={{
                my: 2,
                fontSize: "15px",
                color: "black",
              }}
            >
              Select image to upload
            </Typography>
          </form>
          <Button
            sx={{ textTransform: "capitalize", mt: 3 }}
            variant="contained"
            onClick={() => inputRef.current.click()}
          >
            Browse
          </Button>
        </Box>
      )}
    </Box>
  );
}
