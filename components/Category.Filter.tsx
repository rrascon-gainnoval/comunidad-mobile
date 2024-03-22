import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TextHolder, View, MaterialIcons, Text } from "./Themed";

import * as Colors from "../constants/Colors";
import { theme } from "../constants/Theme";

import { CategoryFilterType } from "../types";
import { ThemeContext } from "../Theme.Provider";

type CategoryFilterProps = {
  categories: CategoryFilterType[];
  onPress: (category: string) => void;
  selectedCategory: string;
};

export const CategoryFilter = (props: CategoryFilterProps) => {
  const { appTheme } = React.useContext(ThemeContext);
  return (
    <View style={styles.container}>
      {props.categories.map((item: CategoryFilterType) => (
        <View style={styles.category} key={Math.random()}>
          <TouchableOpacity
            onPress={() => {
              props.onPress(item.name);
            }}
          >
            <TextHolder style={styles.button}>
              <MaterialIcons
                name={item.icon}
                size={40}
                color={
                  props.selectedCategory !== item.name
                    ? appTheme === "light"
                      ? Colors.default.light.textHalfOpacity
                      : Colors.default.dark.textHalfOpacity
                    : appTheme === "light"
                    ? Colors.default.light.text
                    : Colors.default.dark.text
                }
              />
            </TextHolder>
          </TouchableOpacity>
          <Text style={styles.title}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.marginX,
    paddingVertical: theme.marginY,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    height: 65,
    width: 65,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  category: {
    alignItems: "center",
  },
  title: {
    marginVertical: 5,
  },
});
