import { StyleSheet, Image, Dimensions } from "react-native";
import React, { useEffect } from "react";
import Onboarding from "react-native-onboarding-swiper";
import { TitleText } from "../components/StyledText";
import { setIsFirstTime } from "../utils/storage";
import { primaryColor } from "../constants/Colors";

export function RegisterScreen({ navigation }: any) {
  const windowHeight = Dimensions.get("window").height;

  return (
    <Onboarding
      onDone={() => navigation.navigate("LoginScreen")}
      nextLabel="Siguiente"
      showSkip={false}
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              resizeMode="contain"
              style={{ height: windowHeight * 0.3 }}
              source={require("../assets/images/tsocial.png")}
            />
          ),
          title: (
            <TitleText style={{ marginTop: 0, color: primaryColor }}>
              Acercate a trabajo social
            </TitleText>
          ),
          subtitle:
            "Proporciona tu numero de empleado a un trabajador social y solicita que te agregue a la plataforma",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              resizeMode="contain"
              style={{ height: windowHeight * 0.5 }}
              source={require("../assets/images/changePass.png")}
            />
          ),
          title: (
            <TitleText style={{ marginTop: 0, color: primaryColor }}>
              Crea una nueva contraseña
            </TitleText>
          ),
          subtitle:
            "Inicia sesión con la contraseña que te genero el trabajador social y crea una nueva. ",
        },
      ]}
    />
  );
}
