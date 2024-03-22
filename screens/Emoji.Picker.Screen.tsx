import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  ScrollView,
  TextHolder,
  Text,
  View,
  Container,
} from "../components/Themed";

import { TitleText } from "../components/StyledText";

import { theme } from "../constants/Theme";

const emojis1 = [
  "👨‍🌾",
  "👩‍🌾",
  "👩",
  "🧑",
  "👨",
  "👩‍🦰",
  "🧑‍🦰",
  "👨‍🦰",
  "👱‍♀️",
  "👱",
  "👱‍♂️",
  "👩‍🦳",
  "🧑‍🦳",
  "👨‍🦳",
  "👩‍🦲",
  "🧑‍🦲",
  "👨‍🦲",
  "😁",
];

const emojis2 = [
  "👨🏽‍🌾",
  "👩🏽‍🌾",
  "👩🏽",
  "🧑🏽",
  "👨🏽",
  "👩🏽‍🦰",
  "🧑🏽‍🦰",
  "👨🏽‍🦰",
  "👱🏽‍♀️",
  "👱🏽",
  "👱🏽‍♂️",
  "👩🏽‍🦳",
  "🧑🏽‍🦳",
  "👨🏽‍🦳",
  "👩🏽‍🦲",
  "🧑🏽‍🦲",
  "👨🏽‍🦲",
  "😁",
];

const emojis3 = [
  "👨🏻‍🌾",
  "👩🏻‍🌾",
  "👩🏻",
  "🧑🏻",
  "👨🏻",
  "👩🏻‍🦰",
  "🧑🏻‍🦰",
  "👨🏻‍🦰",
  "👱🏻‍♀️",
  "👱🏻",
  "👱🏻‍♂️",
  "👩🏻‍🦳",
  "🧑🏻‍🦳",
  "👨🏻‍🦳",
  "👩🏻‍🦲",
  "🧑🏻‍🦲",
  "👨🏻‍🦲",
  "😁",
];

export const EmojiPickerScreen = () => {
  const [emojiPack, setEmojiPack] = React.useState<string[]>(emojis1);

  const handleColorPress = (emojiPack: number) => {
    if (emojiPack === 1) {
      setEmojiPack(emojis1);
    }
    if (emojiPack === 2) {
      setEmojiPack(emojis2);
    }
    if (emojiPack === 3) {
      setEmojiPack(emojis3);
    }
  };

  return (
    <ScrollView>
      <View style={styles.colorContainer}>
        <TouchableOpacity
          onPress={() => {
            handleColorPress(1);
          }}
        >
          <Container style={[styles.color, { backgroundColor: "#EDB53F" }]} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleColorPress(2);
          }}
        >
          <Container style={[styles.color, { backgroundColor: "#BF8F68" }]} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleColorPress(3);
          }}
        >
          <Container style={[styles.color, { backgroundColor: "#FADCBC" }]} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {emojiPack.map((emoji, index) => (
          <TextHolder style={styles.iconHolder} key={index}>
            <TouchableOpacity>
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          </TextHolder>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginX,
  },
  emoji: {
    fontSize: 45,
  },
  iconHolder: {
    height: 70,
    width: 70,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    margin: theme.marginX,
  },
  color: {
    height: 45,
    width: 45,
    marginHorizontal: theme.marginX,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.marginY,
  },
});
