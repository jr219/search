import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchInput from '../src/components/SearchInput';
import SiteCard from '../src/components/SiteCard';

const useStyles = makeStyles((theme: Theme) => ({
  mainContainer: {
  },
  infoBackground: {
    backgroundImage: `url("/assets/kayaking.jpeg")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "100%",
    width: "100%",
    paddingTop: "4em",
    paddingBottom: "4em",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  searchHeroText: {
    ...theme.typography.h1,
    [theme.breakpoints.down("lg")]: {
      fontSize: "1.5rem",
    },
    marginBottom: "1.5em"
  },
  searchInputBox: {
  },
  siteListContainer: {
    padding: "24px"
  }
}));

export default function Index() {
  const classes = useStyles();
  const [sites, setSites] = useState([]);
  return (
    <Grid container direction="column" className={classes.mainContainer}>
      <Grid item className={classes.infoBackground}>
        <Typography align="center" className={classes.searchHeroText}>
          Find your next Kayak or Sup Adventure
        </Typography>
        <SearchInput
          className={classes.searchInputBox}
          setBottomSites={setSites}
        />
      </Grid>
      {
        sites.length > 0 &&
        <Typography align="center" sx={{ marginTop: "24px" }}>
          10 hits in a radius of 100 km
        </Typography>
      }
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          className={classes.siteListContainer}
          spacing={{ xs: 2, md: 3 }}
        >
          {sites.map((site, index) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <SiteCard
                site={site}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  );
}
