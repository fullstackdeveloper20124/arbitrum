import { useState, createContext, useEffect } from 'react';

import { Backdrop } from "@mui/material";

// Loader
import { PuffLoader } from "react-spinners";

export const AppContext = createContext({});

export function ContextProvider({ children, openSnackbar }) {
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const toggleTheme = () => {
        window.localStorage.setItem('appTheme', !darkMode);
        setDarkMode(!darkMode);
    }

    useEffect(() => {
        const isDarkMode = window.localStorage.getItem('appTheme');
        if (isDarkMode) {
            // convert to boolean
            setDarkMode(isDarkMode === 'true')
        }
    }, []);

    return (
        <AppContext.Provider
            value={{ toggleTheme, darkMode, setLoading, openSnackbar }}
        >
            <Backdrop
                sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <PuffLoader color={"#00AB55"} size={50} />
            </Backdrop>

            {children}
        </AppContext.Provider>
    );
}
