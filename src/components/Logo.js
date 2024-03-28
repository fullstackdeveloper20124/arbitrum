
// Material
import {
    useTheme, useMediaQuery,
    Box,
    Link
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

function Logo() {
    /*
        xs: 0,
        mobile: 450,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1840
    */
    const theme = useTheme();
    const { darkMode } = useContext(AppContext);
    // const isMobile = useMediaQuery(theme.breakpoints.down('mobile'));

    const img_dark = "/logo/logo_black.png";
    const img_light = "/logo/logo_white.png";

    let img = darkMode ? img_light : img_dark;

    return (
        <Link
            href="/"
            sx={{ pl: 0, pr: 0, py: 0.5, display: 'inline-flex' }}
            underline="none"
            rel="noreferrer noopener nofollow"
        >
            <Box component="img" src={img} sx={{ height: 48 }} />
        </Link>
    );
}

export default Logo;
