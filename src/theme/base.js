// Dark Mode
import { DarkSpacesTheme } from './schemes/DarkSpacesTheme';

// Light Mode
import { PureLightTheme } from './schemes/PureLightTheme';

const themeMap = {
    DarkSpacesTheme,
    PureLightTheme,
};



export function themeCreator(dark) {
    let theme;
    if (dark)
        theme = 'DarkSpacesTheme';
    else
        theme = 'PureLightTheme';
    return themeMap[theme];
}
