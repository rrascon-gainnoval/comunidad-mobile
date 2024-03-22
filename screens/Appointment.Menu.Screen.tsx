import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { HeaderText, TitleText } from "../components/StyledText";

import {
  ScrollView,
  TextHolder,
  MaterialCommunityIcons,
  View,
} from "../components/Themed";
import { AppointmentCreateScreen } from "./Appointment.Create.Screen";

import { theme } from "../constants/Theme";
import { AppointmentListScreen } from "./Appointment.List.Screen";

const menus = [
  { icon: "plus-circle", name: "Agendar" },
  { icon: "view-list", name: "Mis citas" },
];

export const AppointmentMenuScreen = ({ navigation }: any) => {
  const [selectedMenu, setSelectedMenu] = React.useState("Agendar");

  return (
    <ScrollView style={styles.container}>
      <HeaderText>¡Agenda tus citas!</HeaderText>

      <View style={styles.switcher}>
        {menus.map((item) => (
          <TouchableOpacity
            style={{
              opacity: selectedMenu === item.name ? 1 : 0.6,
            }}
            key={Math.random()}
            onPress={() => {
              setSelectedMenu(item.name);
            }}
          >
            <TextHolder style={styles.switcherItem}>
              <MaterialCommunityIcons name={item.icon} size={25} />
              <TitleText>{item.name}</TitleText>
            </TextHolder>
          </TouchableOpacity>
        ))}
      </View>
      {selectedMenu === "Agendar" ? (
        <AppointmentCreateScreen
          handlePress={(params: any) => {
            navigation.navigate("AppointmentScreen", params);
          }}
        />
      ) : (
        <AppointmentListScreen navigation={navigation} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switcher: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: theme.borderRadius,
    marginVertical: theme.marginY,
  },
  switcherItem: {
    borderRadius: 100,
    padding: theme.paddingSm,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
