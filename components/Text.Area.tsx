import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextHolder, TextInput, Text } from "../components/Themed";

import { theme } from "../constants/Theme";

export const TextArea = (props: any) => {
  return (
    <TextHolder style={styles.container}>
      <TextInput
        {...props}
        multiline={true}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        autoCorrect={false}
      />
    </TextHolder>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.marginY,
    marginHorizontal: theme.marginX,
    padding: theme.paddingSm,
    borderRadius: theme.borderRadius,
    height: 120,
  },
  textArea: {
    color: "red",
  },
});
