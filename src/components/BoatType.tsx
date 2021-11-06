import * as React from 'react';
import { Theme } from "@mui/material";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import Box from '@mui/material/Box';
import { getBoatType } from '../utils';

const useStyles = makeStyles((theme: Theme) => ({
  boatType: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    marginLeft: "4px",
    marginRight: "4px"
  },
  boatTypeImage: {
    width: "24px",
    height: "24px",
  },
}));

export default function BoatType(props) {
  const classes = useStyles(props);
  const { productType } = props;
  const boatType = getBoatType(productType);
  return (
    <Box className={classes.boatType}>
      <img
        className={classes.boatTypeImage}
        alt="BoatType"
        src={boatType === "Other" ? "/assets/kayak.png" : `/assets/${boatType.toLowerCase()}.png`}
      />
      <Typography variant="subtitle1" align="center" >
        {boatType}
      </Typography>
    </Box>
  );
}
