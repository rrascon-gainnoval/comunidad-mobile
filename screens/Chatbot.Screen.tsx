import { View, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState, useRef } from "react";

import { TitleText } from "../components/StyledText";
import {
  Container,
  Text,
  TextHolder,
  View as CustomView,
  MaterialCommunityIcons,
} from "../components/Themed";

import { theme } from "../constants/Theme";
import { TouchableOpacity } from "react-native-gesture-handler";

import moment from "moment";
import "moment/locale/es";
import { backend } from "../constants/Backend";
import { ThemeContext } from "../Theme.Provider";

const offlineFAQ: faq[] = [
  {
    question: "¿Cómo contacto a resguarda?",
    answer:
      "Puedes contactar a resguarda vía correo electrónico a etica.grupoalta@resguarda.com, o por teléfono al 800 444 0597.",
  },
  {
    question: "¿Cómo obtengo puntos?",
    answer:
      "Para ganar puntos necesitas contestar trivias o conseguirlos en el cofre de recompensas!",
  },
  {
    question: "¿Para qué sirven mis puntos?",
    answer:
      "Tus puntos sirven para canjear premios y productos en la tienda verde, además de competir por el top 10!",
  },
];

type faq = {
  question: string;
  answer: string;
};

type message = {
  comingIn: boolean;
  message: string;
};

const initialMessage = {
  comingIn: false,
  message:
    "Hola, mi nombre es Timmy Timpson! no soy una persona real pero puedo resolver tus dudas",
};

export function ChatbotScreen() {
  const chatScrollRef: any = useRef();

  let isMounted = true;

  const { appTheme, primaryColor } = React.useContext(ThemeContext);

  const [chat, setChat] = useState<message[]>([initialMessage]);
  const [faq, setFaq] = useState<faq[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleOptionPress = (option: faq) => {
    setTimeout(() => {
      if (isMounted) {
        setIsTyping(true);
      }
    }, 1500);
    let newChat = [...chat];
    newChat.push({
      comingIn: true,
      message: option.question,
    });
    setChat([...newChat]);

    newChat.push({
      comingIn: false,
      message: option.answer,
    });
    setTimeout(() => {
      if (isMounted) {
        setChat([...newChat]);
        setIsTyping(false);
      }
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      if (isMounted) {
        setChat([
          ...chat,
          { comingIn: false, message: "¿Cómo puedo ayudarte?" },
        ]);
      }
    }, 1500);
  }, []);

  const fetchFAQ = async () => {
    await backend
      .get("bot/api/questions/")
      .then((res) => {
        if (isMounted) setFaq(res.data);
      })
      .catch(() => setFaq(offlineFAQ));
  };

  useEffect(() => {
    fetchFAQ();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* <Pressable onPress={() => setShowOptions(false)}> */}
      <ScrollView
        ref={chatScrollRef}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: theme.paddingMd,
        }}
        onTouchStart={() => {
          if (showOptions) {
            setShowOptions(false);
          }
        }}
        onContentSizeChange={() =>
          chatScrollRef.current.scrollToEnd({ animated: true })
        }
      >
        <View style={styles.botContainer}>
          <Image
            style={styles.botImg}
            source={require("../assets/images/bot.png")}
          />
          <TitleText>Timmy</TitleText>
        </View>

        {/* chat start */}
        {chat.map((item) => (
          <TextHolder
            key={Math.random()}
            style={[
              styles.msgBox,
              item.comingIn && {
                backgroundColor: appTheme === "dark" ? "#4D9845" : "#86DB7D",
                alignSelf: "flex-end",
              },
            ]}
          >
            <Text>{item.message}</Text>
            <Text style={{ fontSize: 12, alignSelf: "flex-end", margin: 0 }}>
              {moment().format("LT")}
            </Text>
          </TextHolder>
        ))}
        <Text style={{ margin: 20 }}>{isTyping ? "Escribiendo..." : ""}</Text>
        {/* chat end */}
      </ScrollView>
      {/* </Pressable> */}

      {/* bottom  */}
      {!showOptions && (
        <CustomView style={styles.bottom}>
          <TextHolder style={styles.textInput}>
            <TouchableOpacity
              onPress={() => {
                setShowOptions(!showOptions);
                setTimeout(() => {
                  chatScrollRef.current.scrollToEnd({ animated: true });
                }, 100);
              }}
              style={{ margin: theme.paddingMd }}
            >
              <Text>Elige una pregunta</Text>
            </TouchableOpacity>
          </TextHolder>
          <View style={[styles.button, { backgroundColor: primaryColor }]}>
            <MaterialCommunityIcons name="send" size={18} />
          </View>
        </CustomView>
      )}
      {/* bottom  */}
      {showOptions && (
        <CustomView style={styles.optionsContainer}>
          <TitleText style={{ alignSelf: "center" }}>Preguntas</TitleText>
          <Pressable
            onPress={() => {
              setShowOptions(false);
            }}
            style={styles.closeBtn}
          >
            <MaterialCommunityIcons name="close" size={22} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.optionsScroll}>
            {faq.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  if (!isTyping) {
                    handleOptionPress(item);
                  }
                }}
                key={Math.random()}
              >
                <Container style={styles.msgOption}>
                  <Text>{item.question}</Text>
                </Container>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </CustomView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  botContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.marginY,
  },
  botImg: {
    width: 80,
    height: 80,
  },
  msgBox: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingMd,
    paddingBottom: theme.paddingSm,
    marginTop: theme.marginY * 2,
    marginHorizontal: theme.marginX,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.05,
    shadowRadius: 9.11,
    elevation: 14,
  },
  msgOption: {
    borderRadius: 100,
    margin: 5,
    padding: theme.paddingSm,
  },
  optionsContainer: {
    height: "50%",
    paddingVertical: theme.paddingSm,
  },
  optionsScroll: {
    flexGrow: 1,
    padding: theme.paddingMd,
    alignItems: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 130,
    paddingHorizontal: theme.paddingMd,
  },
  textInput: {
    width: "80%",
    borderRadius: theme.borderRadius,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    right: theme.paddingMd,
    top: theme.paddingMd,
  },
});
