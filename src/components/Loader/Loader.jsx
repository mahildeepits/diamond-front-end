import { Box, CircularProgress } from "@mui/material";
import styles from "./Loader.module.css";
export default function Loader() {
  return (
    <Box className={styles.mainContainer}>
      <CircularProgress
        size={80}
        thickness={3}
        sx={{
          position: "absolute",
          zIndex: 1,
        }}
      />
      <Box className={styles.loader}></Box>
    </Box>
  );
}
