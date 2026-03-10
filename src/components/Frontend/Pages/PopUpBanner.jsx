import { useState, useEffect } from "react";
import { DialogTitle, Dialog, IconButton, DialogContent, Typography, ImageListItemBar, ImageListItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useLocation } from "react-router-dom"; // Import useLocation to check the current route
import { useFetchBannerUpdateQuery } from "../../../store";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

export default function PopUpBanner(){
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [bannerText, setBannerText] = useState('');
    const [bannerData, setBannerData] = useState(null);
    const location = useLocation(); // Get the current route
    const { data, isLoading, error } = useFetchBannerUpdateQuery();
    useEffect(() => {
        if (data) {
            if (data.code == 200) {
                setBannerData(data.data);
                if(bannerData != null && (bannerData.image != undefined && bannerData.image != null) && bannerData.text != undefined && bannerData.text != null){
                    console.log(bannerData,'banner-dta');
                    setImage(bannerData.image); 
                    setBannerText(bannerData.text)
                    setTimeout(() => {
                        const isPopupClosed = localStorage.getItem('popupClosed');
                        const bannerImageLocal = localStorage.getItem('banner_image') ?? null;
                        console.log(data.data.image != bannerImageLocal);
                        if(data.data.image != null && data.data.image != ''){
                            if (isPopupClosed === 'false' || isPopupClosed === null) {
                                setOpen(true);
                            }else if(data.data.image != bannerImageLocal){
                                setOpen(true);
                                localStorage.setItem('popupClosed', 'false');
                                localStorage.setItem('banner_image', data.data.image);
                            }
                        }
                    }, 500);
                }
            } else if (error) {
                toast.error("Error while fetching bank details");
            }
        }
    }, [data, error, bannerData]);

    const handleClose = () => {
        // Set a flag in sessionStorage to indicate that the popup has been closed
        localStorage.setItem('popupClosed', true);
        setOpen(false);
    };

    return (
        <>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogContent>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                    <ImageListItem sx={{}}>
                        <img src={image} width="100%" height="100%" />
                        <ImageListItemBar
                            title={bannerText}
                            sx={{
                                textAlign:"center",
                                bottom:0,
                                height:"100%",
                            }}
                        />
                    </ImageListItem>
                </DialogContent>
            </BootstrapDialog>
        </>
    );
}