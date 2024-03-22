import React, { useContext } from "react";
import { Text, TextProps } from "./Themed";
import { StyleSheet } from "react-native";
import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";

export function MonoText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export const HeaderText = (props: TextProps) => {
  const { primaryColor } = useContext(ThemeContext);

  return (
    <Text
      style={[
        styles.headerText,
        { color: primaryColor },
        styles.margins,
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
};

export const TitleText = (props: TextProps) => {
  return (
    <Text style={[styles.titleText, styles.margins, props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  margins: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
});
