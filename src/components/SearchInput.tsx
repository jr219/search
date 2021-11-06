import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { Theme } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Router from 'next/router';
import axios from '../lib/axios';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: "white",
    border: "1px solid",
    borderColor: theme.palette.secondary.main,
    borderRadius: "25px",
    padding: "5px 15px",
  },
  searchInput: {
    fontSize: "1.2em",
    fontWeight: 400,
    lineHeight: "1.6em",
    border: "none",
    "&:focus": {
      outline: "none",
    }
  },
  searcIcon: {
    color: theme.palette.secondary.main,
  },
  listContainer: {
    width: 400,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer',
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white',
    },
  }
}));

interface PlaceType {
  description: string;
  place_id: string;
  type: string;
}

interface SiteType {
  name: string;
  latitude: number;
  longitude: number;
  type: string;
}

export default function SearchInput(props) {
  const { setBottomSites } = props;
  const classes = useStyles();
  const mountedRef = useRef(true)
  const [cities, setCities] = useState<readonly PlaceType[]>([]);
  const [sites, setSites] = useState<readonly SiteType[]>([]);

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });

  useEffect(() => {
    if (placePredictions.length > 0) {
      setCities(placePredictions.map((p) => ({ ...p, type: "Cities" })));
    }
    // CALL YOUR API OR ASYNC FUNCTION HERE
    return () => { mountedRef.current = false }
  }, [placePredictions]);

  const getSitesByName = useCallback(async (name: string) => {
    try {
      const response = await axios.get(
        `/search/sites/name?name=${name}`
      );

      if (response.status === 200 && response.data) {
        let result = response.data as [SiteType];
        setSites(result.map((p) => ({ ...p, type: "Sites" })));
      } else {
        setSites([]);
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
      setSites([]);
    }
  }, []);

  const getSitesByLocation = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `/search/sites/location?lat=${lat}&lng=${lng}`
      );

      if (response.status === 200 && response.data) {
        let result = response.data as [SiteType];
        setBottomSites(result);
      } else {
        setBottomSites([]);
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
      setBottomSites([]);
    }
  }, []);

  const search = useCallback(async (inputValue: string) => {
    if (inputValue === '') {
      setCities([]);
      setSites([]);
      return;
    }

    getPlacePredictions({ input: inputValue, types: ["(cities)"] });
    await getSitesByName(inputValue);
  }, [getPlacePredictions, getSitesByName]);

  const options = useMemo(() => [...cities, ...sites], [cities, sites]);

  const selectValue = useCallback((e, value) => {
    if (!value) {
      return;
    }
    e.preventDefault();
    console.log(value);
    if (value.type === "Cities") {
      placesService?.getDetails(
        {
          placeId: value.place_id,
        },
        async (placeDetails) => {
          await getSitesByLocation(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng());
        }
      );
    } else {
      Router.push(`/detail/${value.id}`)
    }
  }, []);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        option.type === "Cities" ? option.description : option.name
      }
      isOptionEqualToValue={(option, value) => option.type === "Cities"
        ? option.place_id === value.place_id : option.id === value.id}
      groupBy={(option) => option.type}
      options={options}
      noOptionsText="Please input to search site"
      onChange={(event: any, newValue: any | null) => {
        selectValue(event, newValue);
      }}
      onInputChange={(event, newInputValue) => {
        search(newInputValue);
      }}
      renderInput={(params) => (
        <Paper
          ref={params.InputProps.ref}
          component="form"
          className={classes.container}
          sx={{}}
        >
          <input
            {...params.inputProps}
            className={classes.searchInput}
          />
          <SearchIcon className={classes.searcIcon} />
        </Paper>
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <Box
                  component={option.type === "Cities" ? LocationOnIcon : HomeIcon}
                  sx={{ color: 'text.secondary', mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                <Typography sx={{ fontWeight: 400 }} >
                  {option.type === "Cities" ? option.description : option.name}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
