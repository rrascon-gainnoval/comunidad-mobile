import React, { useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";

import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";

type PrimaryButtonProps = {
  handlePress: () => void;
  text: string;
  isLoading?: undefined | boolean;
  style?: any;
};

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: primaryColor, ...props.style },
      ]}
      onPress={props.isLoading ? () => {} : props.handlePress}
    >
      {props.isLoading ? (
        <ActivityIndicator color={"white"} />
      ) : (
        <Text style={styles.text}>{props.text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginX,
    padding: theme.paddingMd,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
