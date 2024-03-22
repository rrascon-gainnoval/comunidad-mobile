import React, { ReactNode, useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DropdownView } from "../components/DropDown.View";

import { MaterialCommunityIcons, Text, View } from "../components/Themed";

import { theme } from "../constants/Theme";
import { errorColor } from "../constants/Colors";

import moment from "moment";
import "moment/locale/es";

import { Loader } from "../components/Loader";
import { useAlsVisits } from "../hooks/useAlsVisits";
import { ThemeContext } from "../Theme.Provider";

export const DropDownContent = ({
  date,
  time,
  onPress,
  icon,
}: {
  date: string;
  time: string;
  onPress: () => void;
  icon: ReactNode;
}) => {
  return (
    <View style={styles.content}>
      <Text>{moment(date).locale("es-mx").format("LL")}</Text>
      <Text>{time}</Text>
      <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>
    </View>
  );
};

export const AppointmentListScreen = (props: any) => {
  const { primaryColor } = useContext(ThemeContext);
  const visits = useAlsVisits();
  const { isLoading, list } = visits;

  
  return (
    <View>
      {isLoading && <Loader />}

      {!isLoading && (
        <>
          <DropdownView label="Médicas">
            {list.medico.citas.length === 0 &&
              list.medico.historial.length === 0 && (
                <Text style={styles.textCenter}>No hay citas registradas</Text>
              )}
            {list.medico.citas.map((item) => {
              const params = {
                date: item.fecha,
                time: item.hora,
                office: item.consultorio,
                type: "delete",
                id: item.id_cita,
              };

              return (
                <DropDownContent
                  date={params.date}
                  time={params.time}
                  onPress={() => {
                    props.navigation.navigate("AppointmentConfirm", params);
                  }}
                  icon={
                    <MaterialCommunityIcons
                      name="cancel"
                      size={28}
                      color={errorColor}
                    />
                  }
                />
              );
            })}
            {list.medico.historial.map((item) => {
              const { fecha, identificador } = item;
              return (
                <DropDownContent
                  date={fecha}
                  time={""}
                  onPress={() =>
                    props.navigation.navigate("VisitDetails", {
                      visitId: identificador,
                      detailsToken: list.token,
                    })
                  }
                  icon={
                    <MaterialCommunityIcons
                      name={"file-outline"}
                      size={28}
                      color={primaryColor}
                    />
                  }
                />
              );
            })}
          </DropdownView>

          <DropdownView label="Dentales">
            {list.dental.citas.length === 0 &&
              list.dental.historial.length === 0 && (
                <Text style={styles.textCenter}>No hay citas registradas</Text>
              )}
            {list.dental.citas.map((item) => {
              const params = {
                date: item.fecha,
                time: item.hora,
                office: item.consultorio,
                id: item.id_cita,
                type: "delete",
              };

              return (
                <DropDownContent
                  date={params.date}
                  time={params.time}
                  onPress={() => {
                    props.navigation.navigate("AppointmentConfirm", params);
                  }}
                  icon={
                    <MaterialCommunityIcons
                      name="cancel"
                      size={28}
                      color={errorColor}
                    />
                  }
                />
              );
            })}
            {list.dental.historial.map((item) => {
              const { fecha, identificador } = item;
              return (
                <DropDownContent
                  date={fecha}
                  time={""}
                  onPress={() =>
                    props.navigation.navigate("VisitDetails", {
                      visitId: identificador,
                      detailsToken: list.token,
                    })
                  }
                  icon={
                    <MaterialCommunityIcons
                      name={"file-outline"}
                      size={28}
                      color={primaryColor}
                    />
                  }
                />
              );
            })}
          </DropdownView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.paddingSm,
  },
  visitItems: {
    marginVertical: theme.paddingSm,
    alignItems: "center",
  },
  bold: { fontWeight: "bold" },
  textCenter: { textAlign: "center" },
});
