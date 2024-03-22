import { StyleSheet, Image, Dimensions } from "react-native";
import React, { useEffect } from "react";
import Onboarding from "react-native-onboarding-swiper";
import { TitleText } from "../components/StyledText";
import { setIsFirstTime } from "../utils/storage";
import { primaryColor } from "../constants/Colors";

export function OnboardingScreen({ navigation }: any) {
  const windowHeight = Dimensions.get("window").height;

  const finish = async () => {
    await setIsFirstTime(false);
    navigation.navigate("Home");
    navigation.getParent().setOptions({ tabBarStyle: { display: "flex" } });
  };

  return (
    <Onboarding
      onDone={finish}
      nextLabel="Siguiente"
      showSkip={false}
      pages={[
        // {
        //   backgroundColor: "#fff",
        //   image: (
        //     <Image
        //       resizeMode="contain"
        //       style={{ height: windowHeight * 0.55 }}
        //       source={require("../assets/images/ss1.png")}
        //     />
        //   ),
        //   title: (
        //     <TitleText style={{ marginTop: 0, color: primaryColor }}>
        //       ¡Revisa el menu semanal!
        //     </TitleText>
        //   ),
        //   subtitle:
        //     "Puedes revisar el menú de la semana actual y la semana siguiente en cualquier momento",
        // },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              resizeMode="contain"
              style={{ height: windowHeight * 0.55 }}
              source={require("../assets/images/ss2.png")}
            />
          ),
          title: (
            <TitleText style={{ marginTop: 0, color: primaryColor }}>
              ¡Agenda citas!
            </TitleText>
          ),
          subtitle: "Puedes agendar citas en las clinicas disponibles para ti",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              resizeMode="contain"
              style={{ height: windowHeight * 0.55 }}
              source={require("../assets/images/ss3.png")}
            />
          ),
          title: (
            <TitleText style={{ marginTop: 0, color: primaryColor }}>
              ¡Contesta trivias y gana puntos!
            </TitleText>
          ),
          subtitle:
            "Puedes contestar las trivias disponibles y ganar puntos canjeables",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              resizeMode="contain"
              style={{ height: windowHeight * 0.55 }}
              source={require("../assets/images/ss4.png")}
            />
          ),
          title: (
            <TitleText style={{ marginTop: 0, color: primaryColor }}>
              ¡Y mucho más!
            </TitleText>
          ),
          subtitle:
            "Seguro hay algo que te interesa, revisa todas las opciones disponibles",
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({});
