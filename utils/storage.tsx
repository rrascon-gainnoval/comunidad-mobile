import AsyncStorage from "@react-native-async-storage/async-storage";

const isFirstTime = "@ifFirstTime";

export const getIsFirstTime = async () => {
  try {
    const value = await AsyncStorage.getItem(isFirstTime);
    if (value !== null) {
      return JSON.parse(value);
    }
    return true;
  } catch (err) {}
};

export const setIsFirstTime = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(isFirstTime, JSON.stringify(value));
  } catch (err) {}
};

const isTesting = "@isTesting";

export const getIsTesting = async () => {
  try {
    const value = await AsyncStorage.getItem(isTesting);
    if (value === null) {
      return false;
    }
    return JSON.parse(value);
  } catch (err) {}
};

export const storeIsTesting = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(isTesting, JSON.stringify(value));
  } catch (err) {}
};

const privacyTermsKey = "@privacyTerms";

export const getIsPrivacyTermsSigned = async () => {
  try {
    const value = await AsyncStorage.getItem(privacyTermsKey);
    if (value == null) {
      return false;
    }
    return JSON.parse(value);
  } catch (error) {}
};

export const storeIsPrivacyTermsSigned = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(privacyTermsKey, JSON.stringify(value));
  } catch (error) {}
};
