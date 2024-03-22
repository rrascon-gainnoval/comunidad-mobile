import React, { useEffect } from "react";

import NetInfo from "@react-native-community/netinfo";

import {
  StyleSheet,
  Image,
  LayoutAnimation,
  Modal,
  Pressable,
} from "react-native";

import {
  Container,
  MaterialCommunityIcons,
  Text,
  TextHolder,
  View,
} from "../components/Themed";

import { UvaCoins } from "../components/Uva.Coins";
import { HeaderText, TitleText } from "../components/StyledText";
import { SecondaryButton } from "../components/Secondary.Button";
import { PrimaryButton } from "../components/Primary.Button";

import { theme } from "../constants/Theme";

import { backend } from "../constants/Backend";
import { useAppContext } from "../App.Provider";
import { UnavailableContent } from "../components/Unavailable.Content";
import { errorColor } from "../constants/Colors";

type isConnected = boolean | null;

export const BuyConfirmScreen = ({ navigation }: any) => {
  const appContext = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState<isConnected>(false);
  const [user, setUser] = React.useState<any>();
  const [error, setError] = React.useState<string>("");

  const fetchUserDetails = async () => {
    await backend
      .post(
        "users/user_detail/",
        { id_empleado: appContext.user.id },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then((response) => {
        //if (mounted) {
        setUser(response.data);
        //}
      })
      .catch(() => {});
  };

  const addChestKey = async () => {
    if (user.puntos < 10) {
      return setError("¡ No tienes suficientes puntos !");
    }
    backend
      .put(
        "users/agregar_llave/",
        {
          id_empleado: appContext.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then(() => {
        subPoints();
      })
      .catch((err) => {
        console.log("Add llave", err);
      });
  };

  const subPoints = async () => {
    setIsLoading(true);
    backend
      .post(
        "users/alter_points/",
        {
          id_empleado: appContext.user.id,
          puntos: 10,
          tipo: "sub",
          concepto: "Compra de llave para cofre",
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setIsCompleted(true);
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUserDetails();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <HeaderText>Confirmar </HeaderText>
          <TitleText style={{ textAlign: "center" }}>
            ¿Seguro que quieres comprar esta llave?
          </TitleText>
          <Container style={styles.keyContainer}>
            <TextHolder style={styles.key}>
              <Image
                source={require("../assets/images/key.png")}
                style={
                  isCompleted
                    ? { width: 100, height: 100 }
                    : { width: 70, height: 70 }
                }
              />
            </TextHolder>
            {!isCompleted && (
              <View style={{ alignItems: "center" }}>
                <TitleText>Esta llave cuesta:</TitleText>
                <UvaCoins points={10} />
              </View>
            )}
          </Container>
          {!isCompleted && (
            <>
              <PrimaryButton
                text="Confirmar"
                isLoading={isLoading}
                handlePress={isLoading ? () => {} : addChestKey}
              />
              {!isLoading && (
                <SecondaryButton
                  text="Cancelar"
                  handlePress={() => {
                    navigation.goBack();
                  }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <UnavailableContent
          onPressRetry={() => {
            navigation.goBack();
          }}
          description="No cuentas con conexión a internet"
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={error ? true : false}
        onRequestClose={() => {
          setError("");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <MaterialCommunityIcons
              color={errorColor}
              name="close-circle-outline"
              size={80}
            />
            <Text style={styles.error}>{error}</Text>
            <Pressable style={styles.buttonClose} onPress={() => setError("")}>
              <Text style={styles.textStyle}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  keyContainer: {
    padding: theme.paddingLg,
    justifyContent: "center",
    alignItems: "center",
    margin: theme.marginX,
  },
  key: {
    padding: theme.paddingSm,
    borderRadius: theme.borderRadius,
  },
  error: {
    textAlign: "center",
    marginTop: theme.marginY,
    marginBottom: theme.marginX * 4,
    fontSize: theme.fontSizeLg,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "red",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
  },
  modalView: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingLg,
    marginHorizontal: theme.marginX * 2,
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingSm,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
