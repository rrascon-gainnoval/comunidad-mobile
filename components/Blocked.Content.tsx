import { StyleSheet } from "react-native";
import React from "react";
import { MaterialCommunityIcons, Text, View } from "./Themed";
import { TitleText } from "./StyledText";
import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";

export function BlockedContent() {
  const { primaryColor } = React.useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        color={primaryColor}
        name="shield-lock"
        size={150}
      />
      <TitleText style={{ textAlign: "center", fontWeight: "normal" }}>
        Este contenido solo está disponible en horarios de comida y descanso.
      </TitleText>
      {/* <Text style={{ textAlign: "center", fontSize: theme.fontSizeLg }}></Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: theme.marginX,
    alignSelf: "center",
    width: "100%",
  },
});
