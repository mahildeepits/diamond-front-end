import { Box, Typography } from "@mui/material";
import styles from "./Loader.module.css";
import { Error } from "@mui/icons-material";
export default function ErrorComponent() {
  return (
    <Box className={styles.mainContainer}>
      <Error fontSize="large" sx={{ my: 2, color: "red" }} />
      <Typography className={styles.errorText}>
        Error while fetching data
      </Typography>
    </Box>
  );
}
