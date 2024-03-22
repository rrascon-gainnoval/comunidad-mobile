import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import {
  MaterialCommunityIcons,
  ScrollView,
  Text,
  TextHolder,
  View,
} from "../components/Themed";
import { backend } from "../constants/Backend";
import { useAppContext } from "../App.Provider";
import { TextInput } from "../components/Text.Input";
import { TitleText } from "../components/StyledText";
import { theme } from "../constants/Theme";
import SearchBar from "../components/Search.Bar";
import { PrimaryButton } from "../components/Primary.Button";
import { AlertModal } from "../components/Alert.Modal";
import { errorColor, primaryColor } from "../constants/Colors";
import { SecondaryButton } from "../components/Secondary.Button";

type user = {
  nombre: string;
  apellido: string;
  id_empleado: string;
};

type team = {
  id: number;
  name: string;
  members: user[];
  extra: string[];
};

export function EventEnrollTeam({ route, navigation }: any) {
  const appUser = useAppContext().user;
  const { event, isEditing } = route.params;

  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [team, setTeam] = useState<team>({
    id: 0,
    name: "",
    members: [
      {
        nombre: "",
        apellido: "",
        id_empleado: "",
      },
    ],
    extra: [],
  });
  const [modal, setModal] = useState({
    isVisible: false,
    icon: "",
    iconColor: "",
    text: "",
  });

  const filteredUsers = users.filter((user: user) => {
    return user.nombre.toLowerCase().includes(searchValue.toLowerCase());
  });

  const fetchUsers = async () => {
    await backend
      .post("utils/api/eventos/registro/lista/", {
        evento: event.id,
        campo: appUser.location,
      })
      .then((res) => {
        setUsers(res.data);
        if (isEditing) {
          return;
        }
        const defaultUser = res.data.find(
          (user: user) => user.id_empleado === appUser.id
        );
        setTeam({
          ...team,
          members: [defaultUser],
        });
      });
  };

  const handlePressMember = (user: user) => {
    setSearchValue("");
    if (team.members.includes(user)) {
      setTeam({
        ...team,
        members: team.members.filter(
          (member: user) => member.id_empleado !== user.id_empleado
        ),
      });
    } else {
      setTeam({
        ...team,
        members: [...team.members, user],
      });
    }
  };

  const saveTeam = async () => {
    if (!team.name) {
      setModal({
        isVisible: true,
        icon: "alert-circle-outline",
        iconColor: errorColor,
        text: "El nombre de la equipo es requerido",
      });
      return;
    }
    if (team.members.length < 1) {
      setModal({
        isVisible: true,
        icon: "alert-circle-outline",
        iconColor: errorColor,
        text: "Agrega al menos un integrante",
      });
      return;
    }
    const isUserInTeam = team.members.find(
      (user: user) => user.id_empleado === appUser.id
    );
    if (!isUserInTeam) {
      setModal({
        isVisible: true,
        icon: "alert-circle-outline",
        iconColor: errorColor,
        text: "Necesitas incluirte en el equipo para poder registrarte",
      });
      return;
    }
    const data = {
      evento: event.id.toString(),
      nombre: team.name,
      integrantes: team.members.map((member: user) => member.id_empleado),
      adicionales: team.extra.join(","),
    };

    if (isEditing) {
      try {
        await backend.post("utils/api/eventos/equipos/update/", {
          ...data,
          equipo: team.id,
        });
        setModal({
          isVisible: true,
          icon: "check-circle",
          iconColor: primaryColor,
          text: "Equipo actualizado con éxito!",
        });
      } catch (error) {
        console.log(error);

        setModal({
          isVisible: true,
          icon: "alert-circle-outline",
          iconColor: errorColor,
          text: "Hubo un error al actualizar el equipo. Intenta mas tarde",
        });
      }
      setIsLoading(false);
      return;
    }

    try {
      await backend.post("utils/api/eventos/registro/", data);
      setModal({
        isVisible: true,
        icon: "check-circle",
        iconColor: primaryColor,
        text: "Equipo registrado con éxito!",
      });
    } catch (error) {
      setModal({
        isVisible: true,
        icon: "alert-circle-outline",
        iconColor: errorColor,
        text: "Hubo un error al registrar el equipo. Intenta mas tarde",
      });
    }
    setIsLoading(false);
  };

  const fetchTeam = async () => {
    try {
      const res = await backend.post(
        "utils/api/eventos/equipos/detalle/user/",
        {
          evento: event.id,
          id_empleado: appUser.id,
        }
      );
      if (res.data) {
        setTeam({
          id: res.data.id,
          members: res.data.integrantes,
          name: res.data.nombre,
          extra:
            res.data.adicionales.length > 0
              ? res.data.adicionales.split(",")
              : [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEditing) {
      navigation.setOptions({
        title: "Editar equipo",
      });
      fetchTeam();
    }
    fetchUsers();
  }, []);

  return (
    <ScrollView>
      {!isEditing && (
        <View>
          <TitleText>Ingresa el nombre del equipo</TitleText>
          <TextInput
            value={team.name}
            onChangeText={(text: string) => setTeam({ ...team, name: text })}
            placeholder="Nombre del equipo"
          />
        </View>
      )}
      <TitleText>Integrantes</TitleText>
      <View style={styles.membersContainer}>
        {team.members.map((item) => (
          <TouchableOpacity
            onPress={() => handlePressMember(item)}
            key={Math.random()}
          >
            <TextHolder style={styles.chip}>
              <Text>
                {item?.nombre} {item?.apellido}
              </Text>
            </TextHolder>
          </TouchableOpacity>
        ))}
        {team.extra.map((item) => (
          <TouchableOpacity
            onPress={() =>
              setTeam({ ...team, extra: team.extra.filter((i) => i !== item) })
            }
            key={Math.random()}
          >
            <TextHolder style={styles.chip}>
              <Text>{item && item}</Text>
            </TextHolder>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setShowMembers(!showMembers)}>
          <TextHolder style={styles.chip}>
            <Text>
              {showMembers ? (
                <>
                  <MaterialCommunityIcons name="check" size={16} /> Terminar{" "}
                </>
              ) : (
                <>
                  <MaterialCommunityIcons name="plus" size={16} /> Agregar{" "}
                </>
              )}
            </Text>
          </TextHolder>
        </TouchableOpacity>
      </View>

      {showMembers && (
        <View>
          <SearchBar
            onChangeText={(text: string) => setSearchValue(text)}
            value={searchValue}
            style={{ marginVertical: theme.marginX * 2 }}
          />

          {searchValue.split(" ").length > 1 &&
            searchValue.split(" ")[1] !== "" && (
              <TouchableOpacity
                onPress={() => {
                  setTeam({
                    ...team,
                    extra: [...team.extra, searchValue.toLocaleUpperCase()],
                  });
                  setSearchValue("");
                }}
              >
                <TextHolder style={styles.chip}>
                  <MaterialCommunityIcons name="plus-circle" size={20} />
                  <Text style={{ fontWeight: "bold" }}>
                    {`  Agregar a ${searchValue.toLocaleUpperCase()}`}
                  </Text>
                </TextHolder>
              </TouchableOpacity>
            )}

          {filteredUsers.map((user: any) => (
            <TouchableOpacity
              key={Math.random()}
              onPress={() => handlePressMember(user)}
            >
              <TextHolder style={styles.userContainer}>
                <Text>
                  ({user.id_empleado}) {user.nombre} {user.apellido}
                </Text>
              </TextHolder>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <PrimaryButton
        text={isEditing ? "Actualizar" : "Registrar"}
        handlePress={saveTeam}
        style={{
          marginTop: theme.marginY * 2,
        }}
        isLoading={isLoading}
      />
      <SecondaryButton
        style={{
          marginBottom: theme.marginY * 5,
        }}
        text="Cancelar"
        handlePress={() => navigation.goBack()}
      />
      <AlertModal
        visible={modal.isVisible}
        text={modal.text}
        icon={modal.icon}
        iconColor={modal.iconColor}
        onPress={() => {
          if (modal.text.includes("registrado")) {
            navigation.navigate("EventsHome");
          }
          if (modal.text.includes("actualizado")) {
            navigation.goBack();
          }
          setModal({
            ...modal,
            isVisible: false,
          });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    padding: theme.paddingMd,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY / 2,
    borderRadius: theme.borderRadius,
  },
  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: theme.paddingSm,
    paddingHorizontal: theme.paddingMd,
    borderRadius: 50,
    margin: theme.marginX / 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
