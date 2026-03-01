import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { get } from 'lodash';
import CONFIG from '../config.json';
import { disabledSetting, useJSONSetting } from '../settings';

export const ThemeContext = React.createContext({
    theme: 'light',
    toggleTheme: () => {},
});

export const AppThemeProvider = ({
    children,
}: {
    children: React.ReactElement;
}) => {
    const themePalette = get(CONFIG, 'palette', {
        primary: {
            main: 'rgb(45,117,199)',
            contrastText: '#fff',
        },
        secondary: {
            main: 'rgb(0,47,103)',
            contrastText: '#fff',
        },
    });
    const [themeState, setThemeState] = useJSONSetting('theme', {
        type: 'light',
    });

    const theme = responsiveFontSizes(
        createMuiTheme({
            palette: {
                ...themePalette,
                type: themeState.type,
            },
            sidebar: {
                width: 240,
                closedWidth: 72,
            } as any,
            overrides: {
                MuiTableCell: {
                    sizeSmall: {
                        '&:last-child': {
                            paddingRight: null as any,
                        },
                    },
                },
                RaReferenceField: {
                    link: {
                        color: null as any,
                        textDecoration: null as any,
                    },
                } as any,
            },
        })
    );

    const toggleTheme = () => {
        if (disabledSetting('theme')) return;
        const toggledType = themeState.type === 'light' ? 'dark' : 'light';
        setThemeState({ type: toggledType });
    };

    return (
        <ThemeContext.Provider value={{ theme: themeState.type, toggleTheme }}>
            <ThemeProvider theme={theme}>
                {React.cloneElement(children, { theme })}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
