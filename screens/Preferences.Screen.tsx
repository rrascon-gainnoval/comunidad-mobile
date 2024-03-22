import {
  StyleSheet,
  TouchableOpacity,
  View as DefaultView,
} from "react-native";
import React, { useEffect, useContext } from "react";

import {
  Container,
  MaterialCommunityIcons,
  ScrollView,
  Text,
  View,
} from "../components/Themed";
import { HeaderText, TitleText } from "../components/StyledText";

import { theme } from "../constants/Theme";
import {
  storeAppTheme,
  storePrimaryColor,
  ThemeContext,
} from "../Theme.Provider";

import Colors from "../constants/Colors";

const light = Colors.light;
const dark = Colors.dark;

interface themeOption {
  name: string;
  color: string;
  textColor: string;
  theme: "light" | "dark";
}

const themeOptions: Array<themeOption> = [
  {
    color: light.background,
    name: "Claro",
    textColor: light.text,
    theme: "light",
  },
  {
    color: dark.background,
    name: "Oscuro",
    textColor: dark.text,
    theme: "dark",
  },
];

const colors = ["#4EC941", "#E55888", "#E393F1", "#6EAAE1"];

export function PreferencesScreen() {
  const [selectedColor, setSelectedColor] = React.useState(colors[0]);
  const [selectedTheme, setSelectedTheme] = React.useState(0);
  const { appTheme, setAppTheme, primaryColor, setPrimaryColor } =
    useContext(ThemeContext);

  useEffect(() => {
    setSelectedTheme(themeOptions.findIndex((t) => t.theme === appTheme));
    setSelectedColor(primaryColor);
    return () => {};
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TitleText>Imagen de fondo</TitleText>
      <View style={styles.themesContainer}>
        {themeOptions.map((option) => (
          <Container key={Math.random()} style={{ margin: theme.marginX }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedTheme(themeOptions.indexOf(option));
                setAppTheme(option.theme);
                storeAppTheme(option.theme);
              }}
              style={[styles.themeOption, { backgroundColor: option.color }]}
            >
              {selectedTheme === themeOptions.indexOf(option) && (
                <DefaultView style={styles.checkIcon}>
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={option.textColor}
                  />
                </DefaultView>
              )}

              <Text
                style={{
                  color: option.textColor,
                  fontWeight: "bold",
                }}
              >
                {option.name}
              </Text>
            </TouchableOpacity>
          </Container>
        ))}
      </View>
      <TitleText>Color principal</TitleText>
      <View
        style={[styles.themesContainer, { justifyContent: "space-evenly" }]}
      >
        {colors.map((color: string) => (
          <TouchableOpacity
            key={color}
            onPress={() => {
              setSelectedColor(color);
              setPrimaryColor(color);
              storePrimaryColor(color);
            }}
            style={[styles.circle, styles.center, { backgroundColor: color }]}
          >
            {selectedColor === color && (
              <MaterialCommunityIcons name="check" size={24} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <HeaderText>Vista previa</HeaderText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  themeOption: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 100,
  },
  themesContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginVertical: theme.marginY,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 5,
  },
});
