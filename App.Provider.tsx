import React, { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userSessionKey = "user-session-key";

export const setUserSession = async (userSession: any) => {
  try {
    await AsyncStorage.setItem(userSessionKey, JSON.stringify(userSession));
  } catch {}
};

export const getUserSession = async () => {
  try {
    const userSession = await AsyncStorage.getItem(userSessionKey);
    if (userSession) {
      return JSON.parse(userSession);
    } else return null;
  } catch {}
};

export const removeUserSession = async () => {
  try {
    await AsyncStorage.removeItem(userSessionKey);
  } catch {}
};

export const AuthContext = React.createContext(undefined);
export const useAppContext: any = () => useContext(AuthContext);

const menuSurveyKey = "menu-survey-key";

export const setMenuSurvey = async (menuSurvey: any) => {
  try {
    await AsyncStorage.setItem(menuSurveyKey, menuSurvey);
  } catch {}
};

export const getMenuSurvey = async () => {
  try {
    const menuSurvey = await AsyncStorage.getItem(menuSurveyKey);
    if (menuSurvey) {
      return menuSurvey;
    }
    return "";
  } catch {}
};

export const removeMenuSurvey = async () => {
  try {
    await AsyncStorage.removeItem(menuSurveyKey);
  } catch {}
};

const pushTokenKey = "push-token-key";

export const setPushToken = async (pushToken: string) => {
  try {
    await AsyncStorage.setItem(pushTokenKey, pushToken);
  } catch {}
};

export const getPushToken = async () => {
  try {
    const pushToken = await AsyncStorage.getItem(pushTokenKey);
    if (pushToken) {
      return pushToken;
    }
    return null;
  } catch {}
};

export const removePushToken = async () => {
  try {
    await AsyncStorage.removeItem(menuSurveyKey);
  } catch {}
};
