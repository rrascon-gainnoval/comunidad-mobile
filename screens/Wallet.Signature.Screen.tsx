import { StyleSheet, Image } from "react-native";
import React, { useContext, useState } from "react";

import { ScrollView, Text, View } from "../components/Themed";

import Signature from "react-native-signature-canvas";

import { HeaderText, TitleText } from "../components/StyledText";
import { PrimaryButton } from "../components/Primary.Button";

import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";
import { useAppContext } from "../App.Provider";

export const WalletSignature = ({ navigation }: any) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isNext, setIsNext] = useState(false);
  const appContext = useAppContext();

  const { primaryColor } = useContext(ThemeContext);

  const style = `.m-signature-pad--footer
    .button {
      background-color: ${primaryColor};
      color: #FFF;
      font-size: 16px;
    }`;

  const handleSignature = (img: string) => {
    navigation.navigate("WalletCreate", {
      signature: img,
    });
  };

  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      {isNext ? (
        <View>
          <HeaderText>AUTORIZACIÓN DESCUENTO POR CONSUMO</HeaderText>
          <TitleText style={styles.title}>DE TIENDA "SUPER ALTA"</TitleText>
          <Text style={styles.body}>
            Por medio del presente escrito manifiesto mi voluntad y autorizo a
            la empresa
            <Text style={styles.bold}>
              {" {{AGRICOLA ALTA POZO MANUEL SA DE CV}}"}
            </Text>
            , que se realice el descuento vía nomina por la cantidad del consumo
            realizado en la tienda del campo agrícola
            <Text style={styles.bold}> {"{{SANTA LUCIA}}"}</Text>, gozando de la
            prestación otorgada por la empresa{" "}
            <Text style={styles.bold}>Servicio de crédito</Text> el cual me fue
            informado al momento de mi contratación y en la inducción de gozar
            si fuere necesario y solicitado personalmente. Es por ello que
            mediante el presente escrito solicito se me sea descontado
            únicamente el monto consumido sin intereses y debidamente comprobado
            por mi persona con el ticket de compra emitido por la tienda.
          </Text>
          <Text style={styles.body}>
            Una vez manifestado lo anterior el crédito mencionado es
            intransferible, por lo que significa que nadie podrá sacar el
            crédito, ni solicitar información a mi nombre ni en mi
            representación ya sea de forma verbal o escrita; de igual manera
            nadie queda autorizado para que realice en mi representación la
            modificación o cambio de NIP para uso del crédito de tienda.
          </Text>

          <View style={{ height: 380, padding: 10 }}>
            <Signature
              onOK={(img) => {
                handleSignature(img);
              }}
              onBegin={() => setScrollEnabled(false)}
              onEnd={() => setScrollEnabled(true)}
              descriptionText={`${appContext.user.name} ${appContext.user.lastname}`}
              clearText="Limpiar"
              confirmText="Continuar"
              imageType="image/jpeg"
              webStyle={style}
            />
          </View>
        </View>
      ) : (
        <View>
          <Image
            source={require("../assets/images/tsocial.png")}
            style={styles.img}
          />
          <HeaderText>¿Quieres activar tu crédito?</HeaderText>
          <TitleText style={styles.description}>
            Necesitas firmar los términos y condiciones para activar tu crédito.
          </TitleText>
          <PrimaryButton
            text="Siguiente"
            handlePress={() => {
              setIsNext(true);
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  body: {
    marginVertical: theme.marginY,
    marginHorizontal: 20,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
  },
  img: {
    height: 200,
    width: 200,
    alignSelf: "center",
    marginTop: theme.marginY,
  },
  description: {
    textAlign: "center",
    fontWeight: "normal",
    marginBottom: 50,
  },
});
