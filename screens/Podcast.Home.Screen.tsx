import { MaterialCommunityIcons } from "@expo/vector-icons";

import YoutubePlayer from "react-native-youtube-iframe";
import Lottie from "lottie-react-native";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View as DefaultView,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { io } from "socket.io-client";
import { useAppContext } from "../App.Provider";
import { Loader } from "../components/Loader";
import { Text, TextHolder, TextInput, View } from "../components/Themed";
import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";
import { Inbox } from "../types";
import { socketsApi } from "../constants/Backend";

const casterSourceName = "broadcaster";
const consoleSourceName = "console";

export function PodcastHomeScreen() {
  const socket = io("http://172.168.1.217:3000/ws/podcast");

  const { primaryColor } = useContext(ThemeContext);
  const { user } = useAppContext();

  const [inboxList, setInboxList] = useState<Inbox[]>([]);
  const [message, setMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPodcastReady, setIsPodcastReady] = useState(false);
  const [videoCode, setVideoCode] = useState<string>("");

  const filteredInboxList = inboxList.filter(
    (inbox) =>
      inbox.sourceName === `${user.name} ${user.lastname.split(" ")[0]}` ||
      inbox.sourceName === "broadcaster"
  );
  const audioAnimRef = useRef<Lottie>(null);
  const inboxListRef = useRef<FlatList>(null);

  const sendInbox = (sourceName: string, message: string): void => {
    if (!message) {
      return;
    }

    const inbox = {
      sourceName,
      message,
    };
    setInboxList((prev) => [...prev, inbox]);
    setMessage("");

    socket.emit("client:inbox", inbox);
  };

  useEffect(() => {
    socket.on("server:success", () => {
      setIsConnecting(false);
    });

    socket.on("server:inbox", (inbox: Inbox) => {
      setInboxList((prev) => [...prev, inbox]);
    });

    return () => {
      socket.off("connected");
      socket.off("server:inbox");
    };
  }, [socket]);

  const fetchCode = async () => {
    setIsConnecting(true);
    try {
      const res = await socketsApi.get("podcast/code");
      setVideoCode(res.data.code);
    } catch (error) {}
    setIsConnecting(false);
  };

  useEffect(() => {
    fetchCode();
  }, []);

  return (
    <TextHolder style={styles.container}>
      {isPodcastReady && (
        <Lottie
          ref={audioAnimRef}
          style={styles.audioAnim}
          source={require("../assets/lotties/audio.json")}
          autoPlay
          loop
        />
      )}
      {!isPodcastReady && <Loader size="large" />}
      <YoutubePlayer
        onReady={() => {
          setIsPlaying(true);
          setIsPodcastReady(true);
        }}
        height={0}
        play={isPlaying}
        videoId={videoCode}
        volume={100}
      />
      <DefaultView style={styles.controlsContainer}>
        {isPodcastReady && (
          <TouchableOpacity
            onPress={() =>
              setIsPlaying((prev) => {
                if (prev === false) {
                  audioAnimRef.current?.play();
                } else {
                  audioAnimRef.current?.pause();
                }
                return !prev;
              })
            }
          >
            <MaterialCommunityIcons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color={primaryColor}
            />
          </TouchableOpacity>
        )}
      </DefaultView>
      <FlatList
        ref={inboxListRef}
        contentContainerStyle={{
          padding: theme.paddingSm,
        }}
        onContentSizeChange={() => {
          if (filteredInboxList.length > 0) {
            inboxListRef.current?.scrollToEnd();
          }
        }}
        data={filteredInboxList}
        ListEmptyComponent={
          isConnecting ? (
            <Loader size="small" />
          ) : (
            <Text style={styles.transparent}>
              ¡Bienvenido al panel de comentarios!
            </Text>
          )
        }
        keyExtractor={(_item, index: number) => index.toString()}
        renderItem={({ item }) => {
          if (item.sourceName === consoleSourceName) {
            return <Text style={styles.transparent}>{item.message}</Text>;
          }
          return (
            <DefaultView style={styles.messageContainer}>
              {item.sourceName === casterSourceName && (
                <DefaultView style={styles.icon}>
                  <MaterialCommunityIcons
                    color={"white"}
                    name="microphone"
                    size={18}
                  />
                </DefaultView>
              )}
              <Text style={styles.message}>
                <Text style={styles.bold}>{item.sourceName}: </Text>
                {item.message}
              </Text>
            </DefaultView>
          );
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={64}
      >
        <View style={styles.bottom}>
          <TextHolder style={styles.textInputContainer}>
            <TextInput
              value={message}
              onChangeText={(text) => setMessage(text)}
              placeholder="Enviar un mensaje"
            />
          </TextHolder>
          <Pressable
            onPress={() => {
              sendInbox(`${user.name} ${user.lastname.split(" ")[0]}`, message);
            }}
            style={[styles.buttonContainer, { backgroundColor: primaryColor }]}
          >
            <MaterialCommunityIcons size={20} name="send" color={"white"} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TextHolder>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    marginVertical: theme.marginY / 2,
  },
  bold: { fontWeight: "bold" },
  transparent: { opacity: 0.5 },
  icon: {
    backgroundColor: "#dc2626",
    borderRadius: theme.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.marginX,
    height: 20,
    paddingHorizontal: 2,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottom: {
    padding: theme.paddingSm,
    paddingBottom: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  textInputContainer: {
    padding: theme.paddingSm,
    borderRadius: 5,
    flex: 1,
  },
  buttonContainer: {
    padding: theme.paddingSm,
    borderRadius: 100,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.paddingSm,
  },
  audioAnim: {
    width: 150,
    alignSelf: "center",
  },
});
