import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function AccountRemovePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const reason = formData.get("reason");

        if(email && reason) {
            setIsSubmitting(true);
            console.log(email, reason, isSubmitting);
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSubmitted(true);
                console.log(email, reason, isSubmitting);
            }, 5000);
        }else{
            if(!email) setErrors((prev) => ({...prev, email: "Email is required"}));
            if(!reason) setErrors((prev) => ({...prev, reason: "Reason is required"}));
        }
        
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4, p: 4, background: "white", borderRadius: "5px" }}>
                <Typography variant="h5" gutterBottom>
                    Account Removal Request
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }} align="center">
                    We are sorry to see you go. If you would like to remove your account, please provide a reason below and provide your email address. We will remove your account soon after some verification.
                </Typography>

                {
                    !isSubmitted ? (
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <TextField type="email" label="Your email" name="email" error={errors?.email && Boolean(errors?.email)} helperText={ Boolean(errors?.email) && errors?.email } />
                                <TextField
                                    label="Reason for account removal"
                                    name="reason"
                                    multiline
                                    error={errors?.reason && Boolean(errors?.reason)}
                                    helperText={ Boolean(errors?.reason) && errors?.reason }
                                />
                                <Box sx={{ px: 2}}>
                                    <LoadingButton
                                        type="submit"
                                        loading={isSubmitting}
                                        variant="outlined"
                                        color="red"
                                        disabled={isSubmitting}
                                        sx={{ mt: 2, color: "red" }}
                                        >
                                        Request Account Removal
                                    </LoadingButton>
                                </Box>
                            </Box>
                        </form>
                    ) : (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            We are sorry to see you go. but your account removal request has been submitted. we will soon review your request and proceed further to remove your account.
                        </Typography>
                    </Box>
                    )
                }
            </Box>
        </Container>
    )
}