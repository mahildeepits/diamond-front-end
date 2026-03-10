import { Box, Typography } from "@mui/material";
import React from "react";
import DashboardBox from "./DashboardBox";
import { sidebarLinks } from "../../utils/Links";
import { motion } from "framer-motion";

export default function QuickLinksComponents() {
  const variant = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="pageHeading">Quick Links</Typography>
      <Box
        component={motion.div}
        variants={variant}
        initial="hidden"
        animate="visible"
        sx={{
          mt: 1,
          display: "grid",
          gridTemplateColumns: {
            lg: "repeat(4,1fr)",
            md: "repeat(3,1fr)",
            sm: "repeat(2,1fr)",
            xs: "repeat(1,1fr)",
          },
          gridTemplateRows: "repeat(3, minmax(170px, auto))",
          gap: 2,
        }}
      >
        {sidebarLinks()
          .filter((l) => {
            return l.name !== "Dashboard";
          })
          .map((link) => {
            return <DashboardBox key={link.id} data={link} />;
          })}
      </Box>
    </Box>
  );
}
