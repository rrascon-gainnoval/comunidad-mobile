import React, { useCallback, useEffect, useRef } from "react";
import moment from "moment";

import { Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Text, Container, TextHolder } from "./Themed";

import { theme } from "../constants/Theme";
const { paddingSm, marginX } = theme;

export function NominaDirectAccess({
  handlePress,
}: {
  handlePress: () => void;
}) {
  const isSaturday = moment().get("day") === 6; //6 is saturday
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,

          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shakeAnim]);

  useEffect(() => {
    shake();
  }, [shake]);

  if (!isSaturday) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Container style={styles.container}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: shakeAnim,
              },
            ],
          }}
        >
          <Image
            style={styles.img}
            resizeMode="contain"
            source={require("../assets/images/money.png")}
          />
        </Animated.View>
        <TextHolder style={{ padding: paddingSm }}>
          <Text style={styles.text}>
            ¡La información de tu nómina está disponible!
          </Text>
        </TextHolder>
      </Container>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.paddingLg,
    borderRadius: theme.borderRadius,
    margin: marginX,
    alignItems: "center",
  },

  text: { fontWeight: "bold" },
  img: {
    height: 50,
  },
});
