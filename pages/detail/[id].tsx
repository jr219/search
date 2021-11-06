import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CircularProgress from '@mui/material/CircularProgress';
import BoatType from '../../src/components/BoatType';
import Link from '../../src/Link';
import axios from '../../src/lib/axios';

const useStyles = makeStyles((theme: Theme) => ({
  loadingProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  },
  siteLocation: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  locationIcon: {
    width: "24px",
    height: "24px",
  },
  siteContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    '& > div': {
      [theme.breakpoints.up('md')]: {
        flex: 1,
      },
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    marginBottom: "24px",
  },
  siteDescriptionContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  subContainer: {
    padding: "16px 0",
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flex: 1,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  siteImageContainer: {
    position: "relative",
    height: "300px",
    [theme.breakpoints.down("lg")]: {
      height: "250px",
    },
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    cursor: "pointer"
  },
  siteName: {
    ...theme.typography.h4,
    position: "absolute",
    bottom: "8px",
    left: "8px",
    color: "white"
  },
  boatTypeContainer: {
    display: "flex",
    flexDirection: "row",
  },
  siteDetailContainer: {
    padding: "32px",
  },
  beneficiary: {
    ...theme.typography.caption,
  },
  locationText: {
    ...theme.typography.subtitle1,
    marginLeft: "4px",
    marginTop: "4px",
  },
  link: {
    marginLeft: "8px",
    color: "black",
    textDecoration: "none"
  }
}));

const Marker = ({ lat, lng }) => (
  <img
    style={{
      width: "27px",
      height: "43px",
    }}
    alt="SiteImage"
    src="/assets/spotlight-poi2.png"
  />
);

export default function SiteDetail(props) {
  const classes = useStyles(props);
  const router = useRouter()
  const { id } = router.query

  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSiteDetail = async () => {
    setLoading(true);
    setSiteData(null);
    try {
      const response = await axios.get(
        `/search/sites/detail/${id}`
      );
      setLoading(false);

      if (response.status === 200) {
        const result = response.data;
        if (result) {
          setSiteData(result);
        }
      }
    } catch (err: any) {
      console.log(err);
      let error = "Something went wrong to verify certification";
      let statusCode = err.response.status || 0;
      if (statusCode === 401) {
        error = "API-key is not valid or not found, request denied";
      } else {
        if ('message' in err) {
          error = err.message;
        }
      }
      console.log("error", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (id) {
      getSiteDetail();
    }
  }, [id]);

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      {
        loading &&
        <CircularProgress
          size={24}
          className={classes.loadingProgress}
        />
      }
      {
        siteData &&
        <Box sx={{ width: "100%" }}>
          <Box className={classes.siteContainer}>
            <Box
              className={classes.siteImageContainer}
              sx={{ backgroundImage: `url(${siteData.siteImageUrl ? siteData.siteImageUrl : "/assets/kayaking.jpeg"})` }}
            >
              <Typography className={classes.siteName}>
                {siteData.name}
              </Typography>
            </Box>
            <Box className={classes.siteDetailContainer}>
              <Box display="flex">
                <Typography variant="subtitle1" sx={{ mr: "24px" }}>
                  Products:
                </Typography>
                <Box className={classes.boatTypeContainer} >
                  {
                    siteData.typeOfProducts.map((type, index) =>
                      <BoatType
                        key={index}
                        productType={type}
                      />
                    )
                  }
                </Box>
              </Box>
              <Typography variant="subtitle1" gutterBottom>
                {siteData.shorttext}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" sx={{ mr: "24px" }}>
                  Amenities:
                </Typography>
                <Box display="flex" alignItems="center">
                  {
                    siteData.amenities !== "" && siteData.amenities.replace(/(\r\n|\n|\r)/gm, "").split(",").map((a, index) =>
                      <Typography className={classes.beneficiary} key={index}>
                        {a}
                      </Typography>
                    )
                  }
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.siteContainer} sx={{ backgroundColor: "#ECEAE6" }}>
            <Box sx={{ height: '300px', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY }}
                defaultCenter={{
                  lat: siteData.latitude,
                  lng: siteData.longitude
                }}
                defaultZoom={11}
              >
                <Marker
                  lat={siteData.latitude}
                  lng={siteData.longitude}
                />
              </GoogleMapReact>
            </Box>
            <Box className={classes.siteDetailContainer}>
              <Box className={classes.siteLocation} >
                <img
                  className={classes.locationIcon}
                  alt="LocationIcon"
                  src="/assets/location.png"
                />
                <Typography variant="subtitle1" className={classes.locationText}>
                  {siteData.address}
                </Typography>
              </Box>
              <Box className={classes.siteDescriptionContainer}>
                <Box className={classes.subContainer}>
                  <Typography>Opened Time</Typography>
                  <Typography>{siteData.openHours}</Typography>
                </Box>

                <Box className={classes.subContainer}>
                  {siteData.webbUrl &&
                    <Box className={classes.siteLocation} >
                      <img
                        className={classes.locationIcon}
                        alt="SiteImage"
                        src="/assets/website.png"
                      />
                      <Link
                        href={siteData.webbUrl}
                        noLinkStyle
                        target="_blank"
                        className={classes.link}
                      >
                        <Typography variant="subtitle1" className={classes.locationText}>
                          {siteData.webbUrl}
                        </Typography>
                      </Link>
                    </Box>
                  }
                  {siteData.phone &&
                    <Box className={classes.siteLocation} >
                      <img
                        className={classes.locationIcon}
                        alt="SiteImage"
                        src="/assets/mobile.png"
                      />
                      <Link
                        href={`tel:${siteData.phone}`}
                        noLinkStyle
                        target="_blank"
                        className={classes.link}
                      >
                        <Typography variant="subtitle1" className={classes.locationText}>
                          {siteData.phone}
                        </Typography>
                      </Link>
                    </Box>
                  }
                  {siteData.email &&
                    <Box className={classes.siteLocation} >
                      <img
                        className={classes.locationIcon}
                        alt="SiteImage"
                        src="/assets/email.png"
                      />
                      <Link
                        href={`mailto:${siteData.email}`}
                        noLinkStyle
                        target="_blank"
                        className={classes.link}
                      >
                        <Typography variant="subtitle1" className={classes.locationText}>
                          {siteData.email}
                        </Typography>
                      </Link>
                    </Box>
                  }
                </Box>
              </Box>
            </Box>
          </Box>
          <Typography variant="subtitle1" gutterBottom sx={{ padding: "32px" }}>
            {siteData.seotext}
          </Typography>
        </Box>
      }
      {
        !siteData && !loading &&
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "24px" }}>
          No site detail to display
        </Typography>
      }
    </Grid >
  );
}
