import React, { useContext } from "react";
import { StyleSheet, Text, Image, View } from "react-native";

import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";

type UvaCoinsProps = {
  points: number;
  isSmall?: boolean;
  style?: any;
};

export const UvaCoins = (props: UvaCoinsProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <View style={styles.container} {...props}>
      <Text
        style={[
          styles.title,
          {
            color: primaryColor,
            fontSize: props.isSmall ? 18 : 24,
            marginLeft: theme.marginX,
          },
        ]}
      >
        {props.points}
      </Text>
      <Image
        style={[
          props.isSmall ? styles.imageSmall : styles.image,
          { marginRight: theme.marginX },
        ]}
        source={require("../assets/images/grapes.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  image: {
    height: 28,
    width: 28,
  },
  imageSmall: {
    height: 20,
    width: 20,
  },
});
