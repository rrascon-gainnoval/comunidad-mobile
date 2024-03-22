import React, { useRef } from "react";
import { StyleSheet } from "react-native";

import { TextInput } from "./Text.Input";
import { View, Container } from "./Themed";
import { theme } from "../constants/Theme";

type PinInputProps = {
  handleChange: (text: string, inputRef: any, index: number) => void;
};

export function PinInput(props: PinInputProps) {
  const inputRef = useRef<any>();
  const inputRef2 = useRef<any>();
  const inputRef3 = useRef<any>();
  const inputRef4 = useRef<any>();

  return (
    <View style={styles.inputContainer}>
      <Container style={styles.pinInput}>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text: string) => {
            props.handleChange(text, inputRef, 0);
          }}
          style={styles.inputText}
        />
      </Container>
      <Container style={styles.pinInput}>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text: string) => {
            props.handleChange(text, inputRef2, 1);
          }}
          ref={inputRef}
          style={styles.inputText}
        />
      </Container>
      <Container style={styles.pinInput}>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text: string) => {
            props.handleChange(text, inputRef3, 2);
          }}
          ref={inputRef2}
          style={styles.inputText}
        />
      </Container>
      <Container style={styles.pinInput}>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text: string) => {
            props.handleChange(text, inputRef4, 3);
          }}
          ref={inputRef3}
          style={styles.inputText}
        />
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginVertical: theme.marginY,
  },
  pinInput: {
    width: 80,
    marginHorizontal: theme.marginX,
  },
  inputText: {
    fontSize: 24,
  },
});
