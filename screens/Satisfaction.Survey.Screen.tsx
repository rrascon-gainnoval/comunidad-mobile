import React, { useState, useEffect, useContext } from "react";

import {
  StyleSheet,
  View as DefaultView,
  TouchableOpacity,
  LayoutAnimation,
  Image,
} from "react-native";
import { TextHolder, View, Text } from "../components/Themed";
import { HeaderText, TitleText } from "../components/StyledText";
import { TextArea } from "../components/Text.Area";
import { LinkButton } from "../components/Link.Button";
import { PrimaryButton } from "../components/Primary.Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { backend } from "../constants/Backend";
import { theme } from "../constants/Theme";

import { useAppContext } from "../App.Provider";
import { ThemeContext } from "../Theme.Provider";

const emojis = [
  { face: require("../assets/images/happy.png"), value: "Buena" },
  { face: require("../assets/images/regular.png"), value: "Regular" },
  { face: require("../assets/images/sad.png"), value: "Mala" },
];

const messages = [{ topic: "Menu", text: "¿Cómo estuvo la comida de hoy?" }];

export const SatisfactionScreen = ({ navigation, route }: any) => {
  const appContext = useAppContext();
  const { primaryColor } = useContext(ThemeContext);

  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [isBadReview, setIsBadReview] = useState(false);
  const [comments, onChangeText] = useState("");

  const submitResults = async () => {
    if (selectedEmoji === "") {
      alert("Debes seleccionar una opción");
      return;
    }
    setIsLoading(true);

    let data = {
      actividad: route.params.topic,
      calificacion: selectedEmoji,
      id_empleado: appContext.user.id,
      campo: appContext.user.location,
      comentario: comments,
    };
    await backend
      .put("satisfaccion_usuario/satisfaccion/", data, {
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

  const handleEmojiPress = (emoji: string) => {
    setSelectedEmoji(emoji);
    if (emoji !== "Buena") {
      setIsBadReview(true);
    } else {
      setIsBadReview(false);
    }
  };

  const getMessage = () => {
    const message = messages.find(
      (item: any) => item.topic === route.params.topic
    );
    if (message) {
      setMessage(message.text);
    }
  };

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <View style={styles.container}>
      <DefaultView style={styles.title}>
        <HeaderText>
          {isSubmitted ? "¡Gracias por tu aporte!" : message}
        </HeaderText>
        <TitleText style={{ fontWeight: "400", textAlign: "center" }}>
          {isSubmitted
            ? "Tu experiencia ha sido enviada con exito."
            : "Aportar con tu experiencia nos ayuda a mejorar"}
        </TitleText>
      </DefaultView>

      <DefaultView style={styles.emojiContainer}>
        {emojis.map((emoji) => (
          <DefaultView style={{ alignItems: "center" }} key={Math.random()}>
            <TextHolder key={Math.random()} style={styles.emojiBg}>
              <TouchableOpacity
                onPress={() => {
                  handleEmojiPress(emoji.value);
                }}
              >
                <Image
                  resizeMode="contain"
                  source={emoji.face}
                  style={[
                    styles.emoji,
                    emoji.value !== selectedEmoji && { opacity: 0.3 },
                  ]}
                />
              </TouchableOpacity>
            </TextHolder>
            <TitleText>
              {emoji.value === selectedEmoji && emoji.value}
            </TitleText>
          </DefaultView>
        ))}
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
        <View>
          <TextArea
            value={comments}
            onChangeText={onChangeText}
            placeholder="Explicanos el motivo aquí"
          />
          {isBadReview ? (
            <>
              {comments ? (
                <PrimaryButton
                  text="ENVIAR"
                  handlePress={submitResults}
                  isLoading={isLoading}
                />
              ) : null}
            </>
          ) : selectedEmoji ? (
            <PrimaryButton
              text="ENVIAR"
              handlePress={submitResults}
              isLoading={isLoading}
            />
          ) : null}
          <LinkButton
            text="Tienes alguna sugerencia?"
            handlePress={() => {
              navigation.navigate("Suggestions", {
                topic: "Menu",
              });
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  title: {
    alignItems: "center",
  },
  // emoji: {
  //   fontSize: 70,
  // },
  emoji: {
    height: 100,
    width: 100,
  },
  emojiContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiBg: {
    borderRadius: 100,
    marginHorizontal: theme.marginX,
    padding: 5,
  },
  description: {
    marginBottom: 100,
  },
});
