import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Pressable,
} from "react-native";
import { View, Text, Container } from "../components/Themed";
import { HeaderText, TitleText } from "../components/StyledText";
import { PrimaryButton } from "../components/Primary.Button";
import { TextInput } from "../components/Text.Input";

import { theme } from "../constants/Theme";
import { errorColor, linkColor, primaryColor } from "../constants/Colors";

import * as Layout from "../constants/Layout";

import { AuthContext } from "../App.Provider";

import { useKeyboard } from "../hooks/useKeyboard";
import { useIsTesting } from "../hooks/useIsTesting";
import { appInfo } from "../app.info";
import { getIsPrivacyTermsSigned } from "../utils/storage";

const layout = Layout.default;
const isSmallDevice = layout.isSmallDevice;

const bgList = [
  require("../assets/images/female_bg.png"),
  require("../assets/images/male_bg.png"),
];

export const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { signIn } = useContext<any>(AuthContext);
  const isKeyBoardOpen = useKeyboard();
  const testingUrl = useIsTesting();

  const randomBg = useMemo(() => Math.floor(Math.random() * bgList.length), []);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivacyTermsSigned, setIsPrivacyTermsSigned] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const logIn = async () => {
    if (!user) {
      setError("Ingrese un usuario");
      return;
    }
    if (!password) {
      setError("Ingrese una contraseña");
      return;
    }

    if (!isPrivacyTermsSigned && !isChecked) {
      setError("Necesitas aceptar términos y condiciones");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signIn(user, password).catch((err: any) => {
        setError(err.message);
        setIsLoading(false);
      });
    }, 1100);
  };

  useEffect(() => {
    const fetchIsPrivacyTermsSigned = async () => {
      const alreadySigned = await getIsPrivacyTermsSigned();
      if (alreadySigned) {
        setIsPrivacyTermsSigned(true);
      }
    };

    fetchIsPrivacyTermsSigned();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={bgList[randomBg]}
        />
        <View
          style={[
            styles.form,
            isKeyBoardOpen && Platform.OS === "ios" && { paddingBottom: 250 },
          ]}
        >
          <Text style={styles.version}>
            {testingUrl.isTesting &&
              `<testing ${appInfo.versionNumber}> © Innoval`}
          </Text>
          <Pressable
            onLongPress={testingUrl.handleLongPress}
            delayLongPress={3000}
          >
            <HeaderText style={styles.header}>¡Bienvenido/a!</HeaderText>
          </Pressable>

          <TitleText style={styles.translation}>
            (lekuk sjulel a wo’tanik)
          </TitleText>
          <View
            style={{
              marginBottom:
                isKeyBoardOpen && Platform.OS === "android" ? 0 : 30,
            }}
          >
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
              placeholder="No. empleado"
              icon="person"
              autoComplete="off"
              autoCorrect={false}
              onChangeText={(text: string) => setUser(text)}
            />
            <TextInput
              secureTextEntry={true}
              autoCapitalize="none"
              placeholder="Contraseña"
              icon="vpn-key"
              onChangeText={(text: string) => setPassword(text)}
            />
            {!isPrivacyTermsSigned && (
              <View style={styles.privacyTermsContainer}>
                <TouchableOpacity onPress={() => setIsChecked((prev) => !prev)}>
                  <Container style={styles.check}>
                    <View style={isChecked && styles.checkedBox} />
                  </Container>
                </TouchableOpacity>

                <Pressable onPress={() => navigation.navigate("PrivacyTerms")}>
                  <Text>
                    Acepto{" "}
                    <Text style={styles.link}>términos y condiciones</Text>
                  </Text>
                </Pressable>
              </View>
            )}
            <TouchableOpacity
              style={styles.forgotPass}
              onPress={() => navigation.navigate("ForgotPass")}
            >
              <Text>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <PrimaryButton
              text="INICIAR SESIÓN"
              handlePress={logIn}
              isLoading={isLoading}
            />
            <TouchableOpacity
              style={styles.register}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text>¿Aún no estás registrado?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
  },
  header: {
    marginTop: 30,
    marginBottom: 0,
  },
  image: {
    height: isSmallDevice ? 250 : 390,
    width: "100%",
  },
  message: {
    fontWeight: "400",
    textAlign: "center",
  },
  form: {
    flex: 1,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    position: "absolute",
    marginBottom: theme.paddingMd,
    minHeight: isSmallDevice ? 300 : 500,
    width: "100%",
  },
  translation: { marginTop: 0, opacity: 0.9, alignSelf: "center" },
  version: {
    position: "absolute",
    top: theme.marginY,
    alignSelf: "center",
    opacity: 0.9,
    fontWeight: "bold",
  },
  error: {
    alignItems: "flex-end",
    paddingHorizontal: theme.paddingMd,
    color: errorColor,
  },
  forgotPass: {
    alignItems: "flex-end",
    paddingHorizontal: theme.paddingMd,
  },
  register: {
    alignItems: "center",
    paddingHorizontal: theme.paddingMd,
  },
  check: {
    height: 25,
    width: 25,
    padding: 2,
    marginRight: theme.marginX * 2,
    borderWidth: 2,
  },
  privacyTermsContainer: {
    flexDirection: "row",
    padding: theme.paddingSm,
    alignItems: "center",
  },
  link: {
    color: linkColor,
  },
  checkedBox: { backgroundColor: primaryColor, flex: 1 },
});
