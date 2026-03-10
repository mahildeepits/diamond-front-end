import Contact from ""

export default function ContactPage(){
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4, p: 4, background: "white", borderRadius: "5px" }}>
                <Typography variant="h5" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }} align="center">
                    If you have any queries or need help, please contact us at <a href="mailto:anshjewellers41289@gmail.com">Ansh Jewellers</a>
                </Typography>
            </Box>
        </Container>
    );
}