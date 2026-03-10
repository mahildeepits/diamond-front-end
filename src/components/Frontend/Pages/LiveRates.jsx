import FrontEndLiveRatesComponent from "../../AllRatesComponents/FrontEndLiveRatesComponent";
import { Card, CardContent, Container } from "@mui/material";
import { useFetchHomeTextUpdatesQuery } from "../../../store";
import { useState, useEffect } from "react";
import HomepageTextComponent from "../../AllRatesComponents/HomePageTextComponent";
import WhatWeOffer from "./WhatWeOffer";
import OurServices from "./OurServices";
import DownloadOurApp from "./DownloadOurApp";
import Products from "./Products";
import PopUpBanner from "./PopUpBanner";

export default function LiveRates(){
    const [homePageHeaderText, setHomePageHeaderText] = useState([]);
    const { 
        data:headerTextData,
        isLoading:headerTextLoading,
        error:headerTextError
     } = useFetchHomeTextUpdatesQuery({type:"header"});
    useEffect(() => {
        if (headerTextData) {
            if (headerTextData.code == 200) {
                setHomePageHeaderText(headerTextData.data);
                console.log(homePageHeaderText,'header');
            } else if (headerTextError) {
                toast.error("Error while fetching bank details");
            }
        }
    }, [headerTextData, headerTextError, homePageHeaderText]);
    const [homePageFooterText, setHomePageFooterText] = useState([]);
    const { 
        data:footerTextData,
        isLoading:footerTextLoading,
        error:footerTextError
     } = useFetchHomeTextUpdatesQuery({type:"footer"});
    useEffect(() => {
        if (footerTextData) {
            if (footerTextData.code == 200) {
                setHomePageFooterText(footerTextData.data);
                console.log(homePageFooterText,'footer');
            } else if (footerTextError) {
                toast.error("Error while fetching bank details");
            }
        }
    }, [footerTextData, footerTextError, homePageFooterText]);
    return (
        <>
            
        <Card>
            <CardContent>
                <HomepageTextComponent homepageText={homePageHeaderText}/>
                <Container >
                    <FrontEndLiveRatesComponent />
                </Container>
                <HomepageTextComponent homepageText={homePageFooterText}/>
                <Container sx={{my:5, borderBottom:"1px solid lightgrey"}}>
                    <WhatWeOffer />
                </Container>
                <Container sx={{my:5, borderBottom:"1px solid lightgrey"}}>
                    <OurServices />
                </Container>
                <Container sx={{my:5, borderBottom:"1px solid lightgrey"}}>
                    <DownloadOurApp />
                </Container>
                <Container>
                    <Products />
                </Container>
            </CardContent>
            <PopUpBanner  />
        </Card>
        </>
    );
}