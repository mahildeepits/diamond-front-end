import { Box, Paper } from "@mui/material";

export default function HomepageTextComponent({homepageText = []}){
    return (
        <>
            {homepageText.homepage_text != undefined ? (
                <Box sx={{ mt: 4, color: homepageText.text_color }}>
                <marquee><span style={{ backgroundColor: homepageText.background_color || "transparent", padding:'2px 5px' }}>{homepageText.homepage_text}</span></marquee>
                </Box>
            ) : null}
        </>  
    );
}