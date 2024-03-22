import React from "react";

import { StyleSheet, TouchableOpacity } from "react-native";

import { theme } from "../constants/Theme";
import { Container, Text } from "./Themed";

type Time = {
  text: string;
  valor: string;
};

type ChipItemProps = {
  label: string;
  selectedItem: Time;
  onPress: () => void;
};

export const ChipItem = (props: ChipItemProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Container
        style={[
          styles.chip,
          props.label === props.selectedItem.text && {
            opacity: 1,
          },
        ]}
      >
        <Text>{props.label}</Text>
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius,
    margin: theme.marginX,
    padding: theme.paddingSm,
    opacity: 0.4,
  },
});
