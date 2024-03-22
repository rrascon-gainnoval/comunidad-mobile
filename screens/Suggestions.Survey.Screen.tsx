import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View as DefaultView,
  Image,
  LayoutAnimation,
} from "react-native";
import { ScrollView } from "../components/Themed";
import { HeaderText, TitleText } from "../components/StyledText";
import { PrimaryButton } from "../components/Primary.Button";
import { TextArea } from "../components/Text.Area";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { backend } from "../constants/Backend";

import { useAppContext } from "../App.Provider";
import { useKeyboard } from "../hooks/useKeyboard";
import { ThemeContext } from "../Theme.Provider";

export const SuggestionsScreen = ({ navigation, route }: any) => {
  const appContext = useAppContext();
  const { primaryColor } = useContext(ThemeContext);
  const isKeyBoardOpen = useKeyboard();

  const [suggestion, onChangeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitResults = async () => {
    if (suggestion === "") {
      alert("Debes ingresar una sugerencia");
      return;
    }
    setIsLoading(true);
    let data = {
      categoria: route.params.topic,
      sugerencia: suggestion,
      user: appContext.user.id,
      campo: appContext.user.location,
    };
    await backend
      .put("satisfaccion_usuario/sugerencia/", data, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setIsSubmitted(true);
          setTimeout(() => {
            navigation.navigate("TabMenu");
          }, 2000);
        }, 1000);
      });
  };

  return (
    <ScrollView style={styles.container}>
      {!isKeyBoardOpen && (
        <Image
          style={styles.image}
          source={require("../assets/images/tsocial.png")}
        />
      )}
      <DefaultView style={styles.title}>
        <HeaderText style={{ marginBottom: 0 }}>
          ¡Gracias por tu aporte!
        </HeaderText>
        <TitleText style={styles.message}>
          {isSubmitted
            ? "Tu sugerencia ha sido enviada con exito"
            : "Tu opinión importa"}
        </TitleText>
      </DefaultView>
      {isSubmitted ? (
        <DefaultView style={{ alignItems: "center" }}>
          <MaterialCommunityIcons
            name="check-circle"
            size={100}
            color={primaryColor}
          />
        </DefaultView>
      ) : (
        <>
          <TextArea
            value={suggestion}
            onChangeText={onChangeText}
            placeholder="Ingresa una sugerencia..."
          />
          <PrimaryButton
            text="ENVIAR"
            handlePress={submitResults}
            isLoading={isLoading}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 240,
    resizeMode: "contain",
    marginTop: 20,
    alignSelf: "center",
  },
  title: {
    alignItems: "center",
  },
  message: { fontWeight: "400", textAlign: "center" },
});
