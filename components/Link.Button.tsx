import React from "react";

import { StyleSheet, TouchableOpacity } from "react-native";

import { TextHolder, ScrollView, Text } from "../components/Themed";
import { HeaderText, TitleText } from "../components/StyledText";
import { PrimaryButton } from "../components/Primary.Button";

import { theme } from "../constants/Theme";

type LinkButtonProps = {
  text: string;
  handlePress: () => void;
};

export const LinkButton = (props: LinkButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.handlePress}>
      <TitleText style={styles.text}>{props.text}</TitleText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textDecorationLine: "underline",
  },
});
