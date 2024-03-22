import { StyleSheet } from "react-native";
import React from "react";
import { Text } from "./Themed";
import { primaryColor } from "../constants/Colors";

type XpPointsProps = {
  points: number;
  isSmall?: boolean;
};

export function XpPoints({ points, isSmall }: XpPointsProps) {
  return (
    <Text style={[styles.text, isSmall && { fontSize: 16 }]}>
      + {points} EXP
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: primaryColor,
    fontSize: 24,
    fontWeight: "bold",
  },
});
