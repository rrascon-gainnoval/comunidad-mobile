import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Container, ScrollView, Text, View } from "../components/Themed";
import { backend } from "../constants/Backend";
import { theme } from "../constants/Theme";
import { HeaderText, TitleText } from "../components/StyledText";

type user = {
  nombre: string;
  apellido: string;
};

type team = {
  nombre: string;
  adicionales: string;
  integrantes: [];
};

export function EventTeams({ route }: any) {
  const { id, nombre } = route.params.event;
  const [teams, setTeams] = useState<team[]>([]);

  const fetchTeams = async () => {
    try {
      const res = await backend.post("utils/api/eventos/equipos/list/", {
        evento: id,
      });
      setTeams(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <HeaderText>¡Forma parte de un equipo!</HeaderText>
      <TitleText>{nombre}</TitleText>
      {teams.map((team) => (
        <Container key={team.nombre} style={styles.teamItem}>
          <Text style={{ fontWeight: "bold", marginBottom: theme.marginX }}>
            {team.nombre}
          </Text>
          {team.integrantes.map((item: user) => (
            <Text
              key={item.nombre + item.apellido}
            >{`${item.nombre} ${item.apellido}`}</Text>
          ))}
          {team.adicionales
            ? team.adicionales
                .split(",")
                .map((item: string) => <Text>{item}</Text>)
            : null}
        </Container>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  teamItem: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    padding: theme.paddingMd,
  },
});
