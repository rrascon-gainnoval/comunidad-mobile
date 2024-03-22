import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Loader } from "../components/Loader";
import { TitleText } from "../components/StyledText";
import { ScrollView, Text, TextHolder, View } from "../components/Themed";
import { theme } from "../constants/Theme";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { primaryColor } from "../constants/Colors";
import { alsApi } from "../constants/Backend";

const initialDetails = {
  TratamientoDental: [
    {
      tratamiento: "",
    },
  ],
  consulta: {
    fecha: "",
    modulo: "",
  },
  diagnosticos: [
    {
      diagnostico: "",
    },
  ],
  placaDental: [
    {
      procedimiento: "",
      comentario: "",
    },
  ],
  tratamientos: [
    {
      clave: "",
      comentario: "",
      dosis: "",
      duracion: "",
      frecuencia: "",
      medicamento: "",
    },
  ],
};

export function AppointmentVisitDetails({ route }: { route: any }) {
  const { visitId, detailsToken } = route.params;
  const [details, setDetails] = useState(initialDetails);
  const [isLoading, setIsLoading] = useState(false);

  const placaDental = details.placaDental.filter(
    (item: any) => item.tipo_placa !== "0"
  );

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await alsApi.post("citas/detalleVisita", {
        token: detailsToken,
        identificador: visitId,
      });
      setDetails(res.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [visitId, detailsToken]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <TextHolder style={styles.container}>
        <View style={styles.sheet}>
          {/* <TitleText>{moment(details.consulta.fecha).format("LL")}</TitleText> */}
          {isLoading && <Loader />}

          {!isLoading && (
            <>
              <View style={styles.top}>
                <TextHolder style={styles.iconHolder}>
                  {details.consulta.modulo === "dentista" && (
                    <MaterialCommunityIcons
                      name="tooth"
                      size={32}
                      color={primaryColor}
                    />
                  )}
                  {details.consulta.modulo !== "dentista" && (
                    <FontAwesome
                      name="stethoscope"
                      size={32}
                      color={primaryColor}
                    />
                  )}
                </TextHolder>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Fecha: </Text>
                  {moment(details.consulta.fecha).format("ll")}
                </Text>
              </View>

              {details.TratamientoDental.length > 0 && (
                <>
                  <TitleText>Tratamiento dental</TitleText>
                  {details.TratamientoDental.map((item, index) => (
                    <Text key={index} style={{ padding: theme.paddingSm }}>
                      {item.tratamiento}
                    </Text>
                  ))}
                </>
              )}

              {details.diagnosticos.length > 0 && (
                <>
                  <TitleText>Diagnóstico</TitleText>
                  {details.diagnosticos.map((item, index) => (
                    <Text key={index} style={{ padding: theme.paddingSm }}>
                      {item.diagnostico}
                    </Text>
                  ))}
                </>
              )}

              {placaDental.length > 0 && (
                <>
                  <TitleText>Placa dental</TitleText>

                  {placaDental.map((item, index) => (
                    <Text key={index} style={{ padding: theme.paddingSm }}>
                      {item.procedimiento}, {item.comentario}
                    </Text>
                  ))}
                </>
              )}

              {details.tratamientos.length > 0 && (
                <>
                  <TitleText>Medicamentos</TitleText>

                  {details.tratamientos.map((item, index) => (
                    <Text key={index} style={{ padding: theme.paddingSm }}>
                      {item.medicamento}
                      {": "}
                      {item.dosis} {item.frecuencia.toUpperCase()} POR{" "}
                      {item.duracion} DÍAS.
                    </Text>
                  ))}
                </>
              )}
            </>
          )}
        </View>
      </TextHolder>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.paddingSm,
  },
  sheet: {
    padding: theme.paddingMd,
    minHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12.0,
    elevation: 5,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.marginY * 2,
    paddingHorizontal: theme.paddingSm,
  },
  iconHolder: {
    borderRadius: 64,
    paddingVertical: theme.paddingSm / 2,
    paddingHorizontal: theme.paddingSm,
  },
});
