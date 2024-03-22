import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, MaterialIcons, Text } from "../components/Themed";
import { TitleText } from "../components/StyledText";
import { theme } from "../constants/Theme";

type UnavailableContentProps = {
  content?: string;
  small?: boolean | undefined;
  onPressRetry?: () => void;
  description?: string;
};

export const UnavailableContent = (props: UnavailableContentProps) => {
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="sentiment-very-dissatisfied"
        size={props.small ? 40 : 80}
      />
      <TitleText
        style={[
          styles.text,
          props.small && {
            fontSize: 16,
          },
        ]}
      >
        {props.content
          ? props.content + " no está disponible"
          : props.description
          ? props.description
          : "Contenido no disponible"}
      </TitleText>
      {props.onPressRetry && (
        <TouchableOpacity style={styles.retry} onPress={props.onPressRetry}>
          <Text>Reintentar</Text>
          <MaterialIcons name="replay" size={15} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginVertical: theme.marginY,
  },
  retry: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: { textAlign: "center" },
});
