import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function DashboardBox({ data }) {
  const { name, icon, text, href } = data;
  const IconWithSize = (
    <motion.div
      whileHover={{
        x: [-2, 2, -2], // Shaking effect
        transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
      }}
    >
      {React.cloneElement(icon, {
        sx: { fontSize: 35, color: "primary.main", mb: 1 },
      })}
    </motion.div>
  );
  return (
    <Link to={href}>
      <Paper
        component={motion.div}
        whileHover={{
          scale: 1.03,
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        sx={{
          p: 2,
          height: "100%",
          borderRadius: "15px",
          cursor: "pointer",
          background: "#fff",
          color: "black",
          border: "1px solid #b79237",
          ":hover": {
            border: "1px solid",
            borderColor: "#b79237",
            ".text": {
              color: "black",
            },
          },
        }}
      >
        {IconWithSize}
        <Typography color="black" variant="h6">
          {name}
        </Typography>
        <Typography className="text" sx={{ fontSize: "14px", mt: 1 }}>
          {text}
        </Typography>
      </Paper>
    </Link>
  );
}
