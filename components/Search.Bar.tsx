import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "../constants/Theme";

import { TextInput } from "./Text.Input";
import { MaterialCommunityIcons, TextHolder } from "./Themed";

type SearchBarProps = {
  onChangeText: (text: string) => void;
  value?: string;
  placeholder?: string;
  style?: any;
};

export default function SearchBar(props: SearchBarProps) {
  return (
    <TextHolder style={[styles.container, props.style]}>
      <MaterialCommunityIcons name="magnify" size={20} />
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder ? props.placeholder : "Buscar..."}
        containerStyle={styles.input}
      />
    </TextHolder>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.marginX,
    paddingHorizontal: theme.paddingSm,
    borderRadius: theme.borderRadius,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
});
