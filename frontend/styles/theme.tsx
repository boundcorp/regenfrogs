import {
  createTheme,
  responsiveFontSizes,
  Theme,
  ThemeProvider,
} from "@mui/material/styles";
import React, { FC, useContext, createContext } from "react";

const RED = {
  light: "#FF3333",
  main: "#FF0000",
  dark: "#B20000",
  contrastText: "#FFF",
};

const GRAY = {
  light: "#EEE",
  main: "#AAA",
  dark: "#888",
  contrastText: "#000",
};

export const lightModeRed = responsiveFontSizes(
  createTheme({
    palette: {
      primary: GRAY,
      secondary: RED,
      mode: "light",
    },
    typography: {
      fontFamily: "Helvetica Now Display",
      //fontFamily: ["Helvetica Now Display", "Helvetica"],
    },
    components: {
      // Name of the component
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "capitalize",
          },
        },
      },
    },
  })
);

interface ThemeContextInterface {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextInterface | null>(null);

export const ThemeContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = lightModeRed;

  return (
    <ThemeContext.Provider
      value={{
        theme,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);