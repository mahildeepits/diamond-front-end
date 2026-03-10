import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { useFetchBannerUpdateQuery } from "../../store";
import { Box, Container, Typography } from "@mui/material";
import { useFetchHomeTextUpdatesQuery } from "../../store";
import ErrorComponent from "../../components/Loader/ErrorComponent";
import UpdatesComponent from "../../components/UpdatesComponent/UpdatesComponent";
import HomepageTextComponent from "../../components/UpdatesComponent/HomepageTextComponent";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import { useSelector } from "react-redux";
export default function UpdatesPage() {
  const userDetails = useSelector(state => state.CurrentUser.user);
  const isAdmin = userDetails.is_admin === 1;

  const {
    data: homeData,
    isLoading: homeLoading,
    error: homeError,
  } = useFetchHomeTextUpdatesQuery({ type: 'header' });

  const {
    data: bannerData,
    isLoading: bannerLoading,
    error: bannerError,
  } = useFetchBannerUpdateQuery();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Updates</Typography>]}
        />
      </Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">
          {isAdmin ? "Add latest news and updates from market" : "Latest updates"}
        </Typography>
      </Box>

      {bannerLoading ? (
        <Loader />
      ) : bannerError ? (
        <ErrorComponent />
      ) :
        (isAdmin && <UpdatesComponent data={bannerData?.data} />)
      }

      <>
        <br></br>
        {homeLoading ? (
          <Loader />
        ) : homeError ? (
          <ErrorComponent />
        ) : (
          (isAdmin && <HomepageTextComponent data={homeData?.data} type="header" />)
        )}
      </>
    </Container>
  );
}
