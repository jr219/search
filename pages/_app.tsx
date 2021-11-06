import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Head from "next/head";
import { ThemeProvider } from "@mui/styles";
import Theme from "../src/ui/Theme";
import Header from "../src/components/Header";

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const [value, setValue] = useState(0);
  return (
    <React.Fragment>
      <Head>
        <title>GoKaya | Search</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={Theme}>
        <Header
          value={value}
          setValue={setValue}
        />
        <Component
          {...pageProps}
        />
      </ThemeProvider>
    </React.Fragment>
  );
}
