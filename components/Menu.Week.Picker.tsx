import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { View, TextHolder } from "../components/Themed";
import { TitleText } from "../components/StyledText";

import * as Colors from "../constants/Colors";
import { theme as myTheme } from "../constants/Theme";

import { ThemeContext } from "../Theme.Provider";

export const MenuWeekPicker = (props: any) => {
  const { appTheme } = React.useContext(ThemeContext);

  return (
    <View style={styles.weekPicker}>
      <TitleText>Semana:</TitleText>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ marginRight: myTheme.marginX }}
          onPress={props.pressCurrent}
        >
          <TextHolder style={styles.weekLaber}>
            <TitleText
              style={{
                color:
                  props.selectedWeek !== "current"
                    ? appTheme === "light"
                      ? Colors.default.light.textHalfOpacity
                      : Colors.default.dark.textHalfOpacity
                    : appTheme === "light"
                    ? Colors.default.light.text
                    : Colors.default.dark.text,
              }}
            >
              Actual
            </TitleText>
          </TextHolder>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginRight: myTheme.marginX }}
          onPress={props.pressNext}
        >
          <TextHolder style={styles.weekLaber}>
            <TitleText
              style={{
                color:
                  props.selectedWeek !== "next"
                    ? appTheme === "light"
                      ? Colors.default.light.textHalfOpacity
                      : Colors.default.dark.textHalfOpacity
                    : appTheme === "light"
                    ? Colors.default.light.text
                    : Colors.default.dark.text,
              }}
            >
              Siguiente
            </TitleText>
          </TextHolder>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weekPicker: {
    flexDirection: "row",
    marginBottom: myTheme.marginY,
    justifyContent: "space-around",
  },
  weekLaber: {
    borderRadius: 20,
  },
});
