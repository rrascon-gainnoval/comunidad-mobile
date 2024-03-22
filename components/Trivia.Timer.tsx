import React, { useEffect, useState } from "react";

import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "./Themed";
import { theme } from "../constants/Theme";
import Colors from "../constants/Colors";

type ClockTimerProps = {
  seconds: number;
  isRunning: boolean;
  handleTimeOver: () => void;
};

export const ClockTimer = (props: ClockTimerProps) => {
  const [time, setTime] = useState(props.seconds);

  useEffect(() => {
    if (props.isRunning) {
      if (time === 0) {
        return props.handleTimeOver();
      }
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="timer"
        size={20}
        color={Colors.light.text}
      />
      <Text style={styles.text}>{time} s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.paddingSm,
    width: 80,
  },
  text: {
    fontSize: 18,
    marginLeft: 5,
  },
});
