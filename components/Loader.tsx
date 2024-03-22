import React, { useContext } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { ThemeContext } from "../Theme.Provider";

import { LoaderProps } from "../types";

export const Loader = (props: LoaderProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { ...props.style }]}>
      <ActivityIndicator size={props.size} color={primaryColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
});
