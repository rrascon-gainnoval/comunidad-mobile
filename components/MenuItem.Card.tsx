import React from "react";

import {
  StyleSheet,
  View as DefaultView,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import { Container, Text, View } from "../components/Themed";

import { theme } from "../constants/Theme";

type MenuItemProps = {
  weekDay: string;
  meal: string;
  image: { uri: string };
};

export const MenuItemCard = (props: MenuItemProps) => {
  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <Text>{props.weekDay}</Text>
      </View>
      <>
        <ImageBackground
          source={props.image}
          resizeMode="cover"
          style={styles.image}
        >
          <DefaultView style={{ alignItems: "center" }}>
            <DefaultView style={styles.filter}>
              <Text style={styles.text}>{props.meal}</Text>
            </DefaultView>
          </DefaultView>
        </ImageBackground>
      </>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 260,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    alignItems: "center",
  },
  header: {
    padding: 20,
    width: "100%",
  },
  image: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  filter: {
    width: "100%",
    backgroundColor: "rgba(79,79,79,.5)",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 25,
  },
});
