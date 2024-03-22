/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import React from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  TextInput as DefaultTextInput,
  TextInputProps as DefaultTextInputProps,
} from "react-native";

import {
  MaterialIcons as DefaultMaterialIcons,
  MaterialCommunityIcons as DefaultMaterialCommunityIcons,
} from "@expo/vector-icons";

import Colors from "../constants/Colors";
import { theme } from "../constants/Theme";
import { forwardRef } from "react";
import { ThemeContext } from "../Theme.Provider";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { appTheme } = React.useContext(ThemeContext);
  const colorFromProps = props[appTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[appTheme][colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ScrollViewProps = ThemeProps & DefaultScrollView["props"];
export type TextInputProps = ThemeProps & DefaultTextInputProps;

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <DefaultText style={[{ color }, { fontSize: 15 }, style]} {...otherProps} />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextHolder(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textHolderColor"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Container(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "borderColor"
  );

  return (
    <DefaultView
      style={[
        { borderColor, borderWidth: 3, borderRadius: theme.borderRadius },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultScrollView
      showsVerticalScrollIndicator={false}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export const TextInput = forwardRef((props: TextInputProps, ref) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeHolderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textHalfOpacity"
  );

  return (
    <DefaultTextInput
      style={[{ color }, style]}
      placeholderTextColor={placeHolderColor}
      ref={ref}
      {...otherProps}
    />
  );
});

export function MaterialIcons(props: any) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <DefaultMaterialIcons style={style} color={color} {...otherProps} />;
}

export function MaterialCommunityIcons(props: any) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <DefaultMaterialCommunityIcons
      style={style}
      color={color}
      {...otherProps}
    />
  );
}
