import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import { Loader } from "../components/Loader";
import { getUserSession } from "../App.Provider";

export const LoadingScreen = ({ navigation }: any) => {
  const fetchSession = async () => {
    const data = await getUserSession();
    if (data) {
      navigation.navigate("Root");
    } else {
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <View style={styles.container}>
      <Loader size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
