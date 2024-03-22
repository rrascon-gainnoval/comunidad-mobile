import { createContext, useState, useEffect } from "react";
import { primaryColor as DefaultPrimary } from "./constants/Colors";

import AsyncStorage from "@react-native-async-storage/async-storage";
import useColorScheme from "./hooks/useColorScheme";

type ThemeType = "dark" | "light";

interface ThemeContext {
  appTheme: ThemeType;
  setAppTheme: (appTheme: ThemeType) => void;
  primaryColor: string;
  setPrimaryColor: (primaryColor: string) => void;
}

const ThemeContext = createContext<ThemeContext>({
  appTheme: "light",
  setAppTheme: () => {},
  primaryColor: DefaultPrimary,
  setPrimaryColor: () => {},
});

const ThemeProvider = ({ children }: any) => {
  const [appTheme, setAppTheme] = useState<ThemeType>("light");
  const [primaryColor, setPrimaryColor] = useState<string>(DefaultPrimary);

  const fetchStoredAppTheme = async () => {
    let storedAppTheme = await getStoredAppTheme();
    if (!storedAppTheme) {
      storedAppTheme = useColorScheme();
    }
    if (storedAppTheme === "light" || storedAppTheme === "dark") {
      setAppTheme(storedAppTheme);
    }
  };

  const fetchStoredPrimaryColor = async () => {
    let storedPrimaryColor = await getStoredPrimaryColor();
    if (!storedPrimaryColor) {
      storedPrimaryColor = DefaultPrimary;
    }
    setPrimaryColor(storedPrimaryColor);
  };

  useEffect(() => {
    fetchStoredAppTheme();
    fetchStoredPrimaryColor();
  }, []);

  return (
    <ThemeContext.Provider
      value={{ appTheme, setAppTheme, primaryColor, setPrimaryColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };

const appThemeKey = "app-theme-key";

export const storeAppTheme = async (appTheme: string) => {
  try {
    await AsyncStorage.setItem(appThemeKey, appTheme);
  } catch (err) {}
};

export const getStoredAppTheme = async () => {
  try {
    const appTheme = await AsyncStorage.getItem(appThemeKey);
    if (appTheme) {
      return appTheme;
    }
    return "light";
  } catch (err) {}
};

const primaryColorKey = "primary-color-key";

export const storePrimaryColor = async (primaryColor: string) => {
  try {
    await AsyncStorage.setItem(primaryColorKey, primaryColor);
  } catch (err) {}
};

export const getStoredPrimaryColor = async () => {
  try {
    const primaryColor = await AsyncStorage.getItem(primaryColorKey);
    if (primaryColor) {
      return primaryColor;
    }
    return DefaultPrimary;
  } catch (err) {}
};
