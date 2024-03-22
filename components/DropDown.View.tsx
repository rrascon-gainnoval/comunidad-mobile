import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect, Component } from "react";

import { TextHolder, Text, MaterialCommunityIcons } from "./Themed";
import { theme } from "../constants/Theme";

type DropdownViewProps = {
  label: string;
  children: React.ReactNode;
};

export const DropdownView = ({ label, children }: DropdownViewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown}>
        <TextHolder style={styles.transaction}>
          <Text>{label}</Text>
          <MaterialCommunityIcons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
          />
        </TextHolder>
      </TouchableOpacity>
      <View style={[styles.content, !isOpen && { display: "none" }]}>
        {children}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  transaction: {
    flexDirection: "row",
    padding: theme.paddingMd,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: theme.marginY,
    marginHorizontal: theme.marginX,
    borderRadius: theme.borderRadius,
  },
  content: {
    marginHorizontal: theme.marginX,
    paddingHorizontal: 3,
    marginBottom: theme.marginY,
    borderBottomLeftRadius: theme.borderRadius,
    borderBottomRightRadius: theme.borderRadius,
  },
});
