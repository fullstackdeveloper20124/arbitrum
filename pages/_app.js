import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from 'src/AppContext';
import { MetaMaskProvider } from "src/hooks/useMetaMask";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";

function getLibrary(provider, connector) {
  return new Web3(provider);
}

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';

function BloxifiApp(props) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { Component, pageProps } = props;

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />

                {/*
                    <meta name="apple-mobile-web-app-title" content="Snippit"/>
                    <meta name="application-name" content="<APP NAME>"/>
                    <meta name="msapplication-TileColor" content="#ffc40d"/>
                    <meta name="theme-color" content="#ffffff"/>
                */}

                <link rel="manifest" href="/site.webmanifest" />
                {/* <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#121619" /> */}
                <meta name="msapplication-TileColor" content="#121619" />
                <meta name="theme-color" content="#ffffff"/>
            </Head>
            <Web3ReactProvider getLibrary={getLibrary}>
                <MetaMaskProvider>
                    <ContextProvider openSnackbar={openSnackbar}>
                        <ThemeProvider>
                                <SnackbarProvider maxSnack={3}>
                                    <CssBaseline />
                                    <Component {...pageProps} />
                                    <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
                                </SnackbarProvider>
                        </ThemeProvider>
                    </ContextProvider>
                </MetaMaskProvider>
            </Web3ReactProvider>    
        </>
    );
}

export default BloxifiApp;
