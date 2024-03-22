import { Image, StyleSheet } from "react-native";
import React from "react";

import { View, Text } from "../components/Themed";
import { TextInput } from "../components/Text.Input";
import { PrimaryButton } from "../components/Primary.Button";
import { PinInput } from "../components/Pin.Input";
import { HeaderText, TitleText } from "../components/StyledText";

import { backend } from "../constants/Backend";
import { useAppContext } from "../App.Provider";
import { errorColor } from "../constants/Colors";
import { theme } from "../constants/Theme";
import { UnavailableContent } from "../components/Unavailable.Content";

export const WalletModifyPin = ({ navigation }: any) => {
  const appContext = useAppContext();

  const [error, setError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [pin, setPin] = React.useState<{
    pin1: string;
    pin2: string;
    pin3: string;
    pin4: string;
  }>({
    pin1: "",
    pin2: "",
    pin3: "",
    pin4: "",
  });

  const [isFinished, setIsFinished] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handlePinChange = (text: string, inputRef: any, index: number) => {
    setPin({ ...pin, [`pin${index + 1}`]: text });
    if (inputRef.current && text) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = async () => {
    if (
      pin.pin1 === "" ||
      pin.pin2 === "" ||
      pin.pin3 === "" ||
      pin.pin4 === ""
    ) {
      setError("Ingresa los 4 digitos del NIP");
      return;
    }
    if (!password) {
      setError("Ingresa tu contraseña");
      return;
    }
    setIsButtonLoading(true);

    backend
      .post("api/token/", {
        password: password,
        id_empleado: appContext.user.id,
      })
      .then((res) => {
        const lastname = appContext.user.lastname.split(" ");
        backend
          .post(
            "users/cambiar_nip/",
            {
              id_empleado: appContext.user.id,
              nombre: appContext.user.name,
              apellido_paterno: lastname[0],
              apellido_materno: lastname[1],
              pin: pin.pin1 + pin.pin2 + pin.pin3 + pin.pin4,
            },
            {
              headers: {
                Authorization: `Bearer ${appContext.user.token.access}`,
              },
            }
          )
          .then(() => {
            setIsSuccess(true);
          })
          .catch((err) => {
            setIsSuccess(false);
          })
          .finally(() => {
            setIsFinished(true);
            setTimeout(() => {
              navigation.goBack();
            }, 3000);
          });
      })
      .catch((err) => {
        setError("Contraseña incorrecta");
      })
      .finally(() => {
        setIsButtonLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {isFinished ? (
        <View>
          {isSuccess ? (
            <View>
              <Image
                source={require("../assets/images/tsocial.png")}
                style={styles.img}
              />
              <HeaderText>Felicidades!</HeaderText>
              <TitleText style={styles.description}>
                Su NIP ha sido modificado con exito
              </TitleText>
            </View>
          ) : (
            <UnavailableContent description="Hubo un error al modificar tu NIP" />
          )}
        </View>
      ) : (
        <View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TitleText>Ingresa tu nuevo NIP</TitleText>
          <PinInput
            handleChange={(text: string, inputRef: any, index: number) => {
              handlePinChange(text, inputRef, index);
            }}
          />
          <TitleText>Ingresa tu contraseña para confirmar</TitleText>

          <TextInput
            placeholder="Contraseña"
            icon="vpn-key"
            secureTextEntry={true}
            value={password}
            onChangeText={(text: string) => setPassword(text)}
          />
          <PrimaryButton
            text="Continuar"
            handlePress={handleSubmit}
            style={{ marginTop: 80 }}
            isLoading={isButtonLoading}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    alignItems: "flex-end",
    paddingHorizontal: theme.paddingMd,
    color: errorColor,
    marginVertical: theme.marginY,
    fontSize: theme.fontSizeLg,
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
