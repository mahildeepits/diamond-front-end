import { Box, Typography } from "@mui/material"

export default function Banner({name}){
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#000088",
                    color: "white",
                    padding: "50px 0",
                    textAlign: "center",
                }}
                >
                <Typography variant="h4">{name}</Typography>
            </Box>
        </>
    );
}