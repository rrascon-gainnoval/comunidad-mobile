import React from "react";
import { StyleSheet, Platform } from "react-native";

import { Container, useThemeColor, ThemeProps } from "./Themed";
import { Picker as DefaultPicker } from "@react-native-picker/picker";

import { theme } from "../constants/Theme";

type PickerProps = ThemeProps & {
  onValueChange: (value: string) => void;
  selectedValue: string;
  children: React.ReactNode;
};

type PickerItemProps = {
  label: string;
  value: string;
};

export const Picker = (props: PickerProps) => {
  const { lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Container
      style={[styles.container, Platform.OS === "ios" && { height: 80 }]}
    >
      <DefaultPicker
        selectedValue={props.selectedValue}
        onValueChange={props.onValueChange}
        style={{ color: color }}
        itemStyle={{ color: color, height: 50 }}
        dropdownIconColor={color}
      >
        {props.children}
      </DefaultPicker>
    </Container>
  );
};

export const PickerItem = (props: PickerItemProps) => {
  return <DefaultPicker.Item {...props} />;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    justifyContent: "center",
    alignContent: "center",
  },
});
