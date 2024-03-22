import React, { useContext } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";

import { Container, TextHolder } from "./Themed";
import { HeaderText, TitleText } from "../components/StyledText";
import { PrimaryButton } from "../components/Primary.Button";

import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";

type Mood = {
  name: string;
  emoji: string;
};

const moods: Mood[] = [
  {
    name: "contento",
    emoji: "😀",
  },
  {
    name: "triste",
    emoji: "😢",
  },
  {
    name: "desanimado",
    emoji: "😔",
  },
  {
    name: "motivado",
    emoji: "😎",
  },
  {
    name: "emocionado",
    emoji: "😁",
  },
  {
    name: "enamorado",
    emoji: "😍",
  },
  // {
  //   name: "asustado",
  //   emoji: "😱",
  // },
  {
    name: "sorprendido",
    emoji: "😲",
  },
  {
    name: "risueño",
    emoji: "😂",
  },
  {
    name: "enfermo",
    emoji: "🤒",
  },
];

type SocialMoodPickerProps = {
  onPress: (mood: string) => void;
  selectedMood: string;
  isLoading: boolean;
  handleShare: () => void;
};

export const SocialMoodPicker = (props: SocialMoodPickerProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <Container style={styles.container}>
      <TitleText>
        Hoy me siento{" "}
        <TitleText
          style={{
            color: primaryColor,
          }}
        >
          {props.selectedMood}
        </TitleText>
        .
      </TitleText>
      <TextHolder style={styles.emojiHolder}>
        <FlatList
          data={moods}
          keyExtractor={(item) => item.name}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                props.onPress(item.name);
              }}
            >
              <HeaderText
                style={[
                  styles.emoji,
                  props.selectedMood !== item.name && { opacity: 0.3 },
                ]}
              >
                {item.emoji}
              </HeaderText>
            </TouchableOpacity>
          )}
        />
      </TextHolder>
      <PrimaryButton
        text="Compartir"
        handlePress={props.handleShare}
        isLoading={props.isLoading}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
  emoji: {
    fontSize: 48,
  },
  emojiHolder: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
});
