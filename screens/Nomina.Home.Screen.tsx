import React from "react";
import { StyleSheet, Image } from "react-native";
import { TitleText } from "../components/StyledText";
import { View, TextHolder, Text } from "../components/Themed";
import { usePreventScreenCapture } from "expo-screen-capture";

import { theme } from "../constants/Theme";
import { errorColor, primaryColor } from "../constants/Colors";
import { useNomina } from "../hooks/useNomina";
import { useAppContext } from "../App.Provider";
import { UnavailableContent } from "../components/Unavailable.Content";

export function PaperCutting() {
  return (
    <View style={styles.cuttingContainer}>
      <TextHolder style={styles.cutting} />
      <TextHolder style={styles.cutting} />
      <TextHolder style={styles.cutting} />
      <TextHolder style={styles.cutting} />
      <TextHolder style={styles.cutting} />
      <TextHolder style={styles.cutting} />
    </View>
  );
}

export function NominaHomeScreen() {
  usePreventScreenCapture();
  const { user } = useAppContext();
  const nomina = useNomina(user.id);
  const { errorCode, total_perception, total_deduction, net_pay } = nomina;

  if (errorCode === 404) {
    return (
      <UnavailableContent description="Los detalles de nómina no están disponibles." />
    );
  }

  if (errorCode === 401) {
    return (
      <UnavailableContent description="Éste contenido solo está disponible los Sábados" />
    );
  }

  return (
    <TextHolder style={styles.container}>
      <View style={styles.payrollContainer}>
        <PaperCutting />

        <Image
          style={styles.image}
          source={require("../assets/images/money.png")}
        />
        <TitleText style={styles.title}>Detalle de tu nómina</TitleText>
        <TextHolder style={styles.separator} />

        <View style={styles.row}>
          <Text>Ganancias</Text>
          <TitleText style={[styles.bold, { color: primaryColor }]}>
            {total_perception}
          </TitleText>
        </View>
        <View style={styles.row}>
          <Text>Descuentos</Text>
          <TitleText style={[styles.bold, { color: errorColor }]}>
            - {total_deduction}
          </TitleText>
        </View>

        <View style={styles.bottom}>
          <TextHolder style={styles.separator} />
          <View style={styles.row}>
            <TitleText style={styles.total}>TOTAL</TitleText>
            <TitleText style={styles.netPay}>{net_pay}</TitleText>
          </View>
        </View>
      </View>
    </TextHolder>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.paddingMd,
  },
  payrollContainer: {
    paddingHorizontal: theme.paddingMd,
    paddingTop: theme.paddingSm * 3,
    paddingBottom: theme.paddingLg * 2,
    margin: theme.marginX,
    height: 500,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16.0,
    elevation: 5,
  },
  cutting: {
    // backgroundColor: "#f8f8fa",
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  cuttingContainer: {
    position: "absolute",
    top: -20,
    flexDirection: "row",
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.marginY * 3,
  },
  title: {
    alignSelf: "center",
    marginBottom: theme.marginY * 2,
  },
  total: {
    marginHorizontal: 0,
    fontWeight: "normal",
  },
  bottom: { marginTop: "auto" },
  separator: {
    width: "100%",
    height: 3,
    marginBottom: theme.marginY,
  },
  bold: {
    fontWeight: "bold",
    marginHorizontal: 0,
    marginVertical: 0,
  },
  image: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    alignSelf: "center",
  },
  netPay: {
    fontSize: 24,
    marginHorizontal: 0,
  },
});
