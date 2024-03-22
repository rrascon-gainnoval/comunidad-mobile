import React, { useContext } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  View as DefaultView,
} from "react-native";
import { Text, View, TextHolder, Container } from "./Themed";
import { UvaCoins } from "./Uva.Coins";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../constants/Theme";

import { TriviaCardProps } from "../types";
import { ThemeContext } from "../Theme.Provider";

export const TriviaCard = (props: TriviaCardProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={props.done ? () => {} : props.handlePress}>
      <Container style={styles.container}>
        <Text style={[styles.text, styles.title]}>{props.title}</Text>
        <TextHolder style={[styles.descriptionContainer]}>
          <Text style={styles.text}>{props.description}</Text>
        </TextHolder>
        <View style={styles.detailsContainer}>
          {props.done ? (
            <DefaultView style={styles.doneContainer}>
              <MaterialCommunityIcons
                name="check-bold"
                size={20}
                color={primaryColor}
              />
              <Text style={[styles.title, { color: primaryColor }]}>
                Realizada
              </Text>
            </DefaultView>
          ) : (
            <UvaCoins points={props.points} />
          )}
          <Text style={styles.title}>{props.quiz.length} Preguntas</Text>
        </View>
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
  descriptionContainer: {
    padding: theme.paddingSm,
    borderRadius: theme.borderRadius,
  },
  detailsContainer: {
    width: "100%",
    padding: theme.paddingSm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  title: {
    fontSize: 18,
    margin: theme.marginY,
    fontWeight: "bold",
  },
  doneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
