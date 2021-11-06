import React, { useState, useEffect } from "react";
import { Theme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Hidden from "@mui/material/Hidden";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { useTheme, makeStyles } from "@mui/styles";
import Link from "../Link";

// This function is used to make the header sticky
function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

// USED FOR STYLING THE THEME
const useStyles = makeStyles((theme: Theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
  },
  logo: {
    height: "8em",
    textTransform: "none",
    [theme.breakpoints.down("md")]: {
      height: "7em",
    },
    [theme.breakpoints.down("xs")]: {
      height: "5.5em",
    },
  },
  logoContainer: {
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  tabContainer: {
    marginLeft: "auto",
  },
  tab: {
    ...theme.typography.subtitle2,
    minWidth: 10,
    marginLeft: "1em",
    marginRight: "1em",
    cursor: "pointer",
  },
  button: {
    borderRadius: "50px",
    marginLeft: "50px",
    marginRight: "25px",
    fontSize: "1rem",
    textTransform: "none",
    height: "45px",
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  menu: {
    color: "primary",
    borderRadius: "0px",
    zIndex: 1302,
  },
  menuItem: {
    ...theme.typography.subtitle2,
    opacity: 0.7,
    "&:hover": {
      opacity: 1,
    },
    color: "white",
  },
  drawerIconContainer: {
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  drawerIcon: {
    height: "36px",
    width: "36px",
    color: theme.palette.info.main,
  },
  drawer: {
    backgroundColor: "white",
  },
  drawerItem: {
    ...theme.typography.subtitle2,
    opacity: 0.7,
  },
  drawerItemBook: {
    backgroundColor: theme.palette.primary.main,
  },
  drawerItemSelected: {
    "& .MuiListItemText-root": {
      opacity: 1,
    },
  },
  drawerItemBookText: {
    ...theme.typography.subtitle2,
    opacity: 0.7,
    color: "white !important"
  },
  appbar: {
    zIndex: theme.zIndex.modal + 1,
    paddingLeft: "4em",
    paddingRight: "4em",
    [theme.breakpoints.down("lg")]: {
      paddingLeft: "1em",
      paddingRight: "1em",
    },
  },
}));

export default function Header(props) {
  const classes = useStyles(props);
  const router = useRouter();

  // @ts-ignore
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  //   React useState hook
  const [openDrawer, setOpenDrawer] = useState(false);

  //   handle change function
  const handleChange = (e, newValue) => {
    props.setValue(newValue);
  };

  const routes = [
    { name: "How it works", link: "/guide", activeIndex: 0 },
    { name: "Partners", link: "/partners", activeIndex: 1 },
    { name: "For businesses", link: "/businesses", activeIndex: 2 },
    { name: "About Us", link: "/about", activeIndex: 3 },
    { name: "Contact", link: "/contact", activeIndex: 4 },
  ];

  const path = typeof window !== "undefined" ? window.location.search : null;

  const activeIndex = () => {
    const found = routes.find((route) => route.link === path);

    if (found === undefined) {
      props.setValue(false);
    } else {
      props.setValue(found.activeIndex);
    }
  };

  useEffect(() => {
    activeIndex();
  }, [path]);

  //   TABS
  const tabs = (
    <React.Fragment>
      <Box className={classes.tabContainer} >
        {
          routes.map((route, index) => (
            <Link
              key={`${route}${index}`}
              className={classes.tab}
              href={route.link}
              noLinkStyle
            >
              {route.name}
            </Link>
          ))
        }
      </Box>
      <Button
        component={Link}
        href="/book"
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => props.setValue(5)}
      >
        Book Now
      </Button>
    </React.Fragment >
  );

  // Swipable Drawer
  const drawer = (
    <React.Fragment>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
        onOpen={() => {
          setOpenDrawer(true);
        }}
        classes={{ paper: classes.drawer }}
      >
        <div className={classes.toolbarMargin} />
        <List disablePadding>
          {routes.map((route) =>
            <ListItem
              key={`${route}${route.activeIndex}`}
              divider
              button
              component={Link}
              href={route.link}
              selected={props.value === route.activeIndex}
              classes={{ selected: classes.drawerItemSelected }}
              onClick={() => {
                setOpenDrawer(false);
                props.setValue(route.activeIndex);
              }}
            >
              <ListItemText className={classes.drawerItem} disableTypography>
                {route.name}
              </ListItemText>
            </ListItem>
          )}

          <ListItem
            onClick={() => {
              setOpenDrawer(false);
              props.setValue(5);
            }}
            divider
            button
            component={Link}
            href="/book"
            classes={{
              root: classes.drawerItemBook,
              selected: classes.drawerItemSelected,
            }}
            selected={props.value === 5}
          >
            <ListItemText className={classes.drawerItemBookText} disableTypography>
              Book now
            </ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
      <IconButton
        className={classes.drawerIconContainer}
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar position="fixed" className={classes.appbar} color="inherit" enableColorOnDark={false}>
          <Toolbar disableGutters>
            <Button
              className={classes.logoContainer}
              onClick={() => {
                router.replace("/");
              }}
              disableRipple
              style={{ textDecoration: "none" }}
            >
              <img style={{ height: "40px" }} src="/assets/logo.png" />
            </Button>
            <Hidden lgDown>{tabs}</Hidden>
            <Hidden lgUp>{drawer}</Hidden>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </React.Fragment>
  );
}