import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";
import {
  TextHolder,
  TextInput as ThemedTextInput,
  MaterialIcons,
} from "../components/Themed";
import { theme } from "../constants/Theme";

export const TextInput = forwardRef((props: any, ref) => (
  <TextHolder style={[styles.container, props.containerStyle]}>
    {props.icon && (
      <MaterialIcons name={props.icon} size={20} style={styles.icon} />
    )}
    <ThemedTextInput
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChangeText}
      style={styles.textInput}
      ref={ref}
      {...props}
    />
  </TextHolder>
));

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.marginY,
    marginHorizontal: theme.marginX,
    padding: theme.paddingMd,
    borderRadius: theme.borderRadius,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.marginX,
  },
  textInput: {
    width: "90%",
  },
});
