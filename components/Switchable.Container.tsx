import { StyleSheet, TouchableOpacity } from "react-native";

import React from "react";

import { View, TextHolder, MaterialCommunityIcons } from "./Themed";
import { TitleText } from "./StyledText";

import { theme } from "../constants/Theme";

export const SwitchableContainer = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: theme.marginX,
  },
});
