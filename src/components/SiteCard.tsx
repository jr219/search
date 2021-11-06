import * as React from 'react';
import { Theme } from "@mui/material";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import Box from '@mui/material/Box';
import BoatType from './BoatType';
import Link from '../Link';

const useStyles = makeStyles((theme: Theme) => ({
  siteImageContainer: {
    position: "relative",
    height: "250px",
    [theme.breakpoints.down("lg")]: {
      height: "200px",
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
  siteDetailContainer: {
    padding: "8px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  siteLocation: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: "24px",
    height: "24px",
  },
  locationText: {
    ...theme.typography.subtitle1,
    marginLeft: "4px"
  },
  boatTypeContainer: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default function SiteCard(props) {
  const { site } = props;
  const classes = useStyles();
  return (
    <Paper>
      <Link
        href={`/detail/${site.id}`}
        noLinkStyle
      >
        <Box
          className={classes.siteImageContainer}
          sx={{ backgroundImage: `url(${site.siteImageUrl ? site.siteImageUrl : "/assets/kayaking.jpeg"})` }}
        >
          <Typography className={classes.siteName}>
            {site.name}
          </Typography>
        </Box>
        <Box className={classes.siteDetailContainer}>
          <Box className={classes.siteLocation} >
            <img
              className={classes.locationIcon}
              alt="SiteImage"
              src="/assets/location.png"
            />
            <Typography variant="subtitle1" className={classes.locationText}>
              {site.address}
            </Typography>
          </Box>
          <Box className={classes.boatTypeContainer} >
            {
              site.typeOfProducts.map((type, index) =>
                <BoatType
                  key={index}
                  productType={type}
                />
              )
            }
          </Box>
        </Box>
      </Link>
    </Paper >
  );
}
