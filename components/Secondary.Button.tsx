import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";

import { MaterialCommunityIcons, TextHolder, View } from "./Themed";

import Colors from "../constants/Colors";
import { theme } from "../constants/Theme";

import { ThemeContext } from "../Theme.Provider";

type SecondaryButtonProps = {
  handlePress: () => void;
  text: string;
  isLoading?: undefined | boolean;
  style?: any;
  icon?: undefined | string;
  containerStyle?: any;
};

export const SecondaryButton = (props: SecondaryButtonProps) => {
  const { appTheme } = React.useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={{ ...props.containerStyle }}
      onPress={props.handlePress}
    >
      <TextHolder
        style={[
          styles.container,
          appTheme === "dark" ? styles.dark : styles.light,
          { ...props.style },
        ]}
      >
        {props.isLoading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              size={16}
              name={props.icon}
              style={styles.icon}
            />
            <Text
              style={[
                styles.text,
                appTheme === "dark" ? styles.dark : styles.light,
              ]}
            >
              {props.text}
            </Text>
          </View>
        )}
      </TextHolder>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginX,
    padding: theme.paddingMd,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
  dark: {
    color: Colors.dark.text,
    borderColor: Colors.light.text,
  },
  light: {
    color: Colors.light.text,
    borderColor: Colors.dark.text,
  },
  icon: {
    marginRight: theme.marginX,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
