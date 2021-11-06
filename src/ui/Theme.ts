import { createTheme } from '@mui/material/styles';

const arcBlue = "#004E31";
const arcOrange = "#D15240";
const arcYellow = "#FFAB1C";
const arcGrey = "#ECEAE6";

export default createTheme({
  palette: {
    primary: {
      main: `${arcBlue}`,
    },
    secondary: {
      main: `${arcOrange}`,
    },
    info: {
      main: `${arcYellow}`,
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "white",
      lineHeight: 1.5,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "white",
    },
    h3: {
      fontSize: "2.5rem",
      color: "white",
    },
    h4: {
      fontSize: "1.75rem",
      color: arcBlue,
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
      color: arcBlue,
      lineHeight: 1,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      color: `${arcBlue}`,
      textTransform: "none",
      fontWeight: 700,
      fontSize: "1em",
    },
    body1: {
      fontSize: "1.25em",
      color: arcGrey,
      fontWeight: 300,
    },
    caption: {
      backgroundColor: arcGrey,
      padding: "2px 8px",
      borderRadius: "12px",
      margin: "4px"
    },
  },
});
