import React, { useState, useEffect } from "react";

import { StyleSheet, LayoutAnimation } from "react-native";
import { ScrollView, View, Text } from "../components/Themed";

import { MenuItemCard } from "../components/MenuItem.Card";
import { LinkButton } from "../components/Link.Button";
import { CategoryFilter } from "../components/Category.Filter";
import { Loader } from "../components/Loader";
import { UnavailableContent } from "../components/Unavailable.Content";
import { HeaderText } from "../components/StyledText";
import { MenuWeekPicker } from "../components/Menu.Week.Picker";

import { backend } from "../constants/Backend";

import { CategoryFilterType } from "../types";

import { useAppContext, getMenuSurvey, setMenuSurvey } from "../App.Provider";

const weekDays: string[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const categories: CategoryFilterType[] = [
  { name: "Desayuno", icon: "free-breakfast" },
  { name: "Comida", icon: "lunch-dining" },
  { name: "Cena", icon: "nightlight-round" },
];

export function TabMenuScreen({ navigation }: any) {
  const appContext = useAppContext();

  const [mealType, setMealType] = useState<string>("Desayuno");
  const [meals, setMeals] = useState<any>([]);
  const [isFetching, setIsfetching] = useState<boolean>(true);
  const [selectedWeek, setSelectedWeek] = useState<string>("current");
  let mounted = true;
  /**
   * post data hardcoded
   */
  const fetchWeekMenu = async () => {
    setIsfetching(true);
    const data = { campo: appContext.user.location };

    await backend
      .post("menus/get_menu/", data, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((response) => {
        if (mounted) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setMeals(response.data[0].platillos);
          if (selectedWeek === "next") {
            setMeals(response.data[1].platillos);
          }
          setIsfetching(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsfetching(false);
        }
      });
  };

  const checkForSurvey = async () => {
    const isSurvey = await getMenuSurvey();
    if (isSurvey === "true") {
      navigation.navigate("SatisfactionSurvey", {
        topic: "Menu",
      });
      setMenuSurvey("done");
    }
  };

  useEffect(() => {
    checkForSurvey();
    fetchWeekMenu();
    return () => {
      mounted = false;
    };
  }, [mealType, selectedWeek]);

  return (
    <>
      {isFetching ? (
        <Loader size="large" />
      ) : meals.length > 0 ? (
        <ScrollView style={{ flex: 1 }} stickyHeaderIndices={[2]}>
          <HeaderText style={styles.header}>
            ¡Revisa el menu semanal!
          </HeaderText>
          <MenuWeekPicker
            selectedWeek={selectedWeek}
            pressCurrent={() => setSelectedWeek("current")}
            pressNext={() => setSelectedWeek("next")}
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={mealType}
            onPress={(item) => {
              setMealType(item);
            }}
          />
          {weekDays.map((item, index) => (
            <MenuItemCard
              key={index}
              weekDay={item}
              meal={
                mealType === "Desayuno"
                  ? meals[index]?.desayuno.nombre
                  : mealType === "Comida"
                  ? meals[index]?.comida.nombre
                  : meals[index]?.cena.nombre
              }
              image={
                mealType === "Desayuno"
                  ? { uri: meals[index]?.desayuno.imagen }
                  : mealType === "Comida"
                  ? { uri: meals[index]?.comida.imagen }
                  : { uri: meals[index]?.cena.imagen }
              }
            />
          ))}
          <Text style={styles.terms}>
            *Los platillos listados pueden estar sujetos a cambios o
            modificaciones.*
          </Text>
          <LinkButton
            text="¿Quieres proponer algún platillo?"
            handlePress={() => {
              navigation.navigate("Suggestions", {
                topic: "Menu",
              });
            }}
          />
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <HeaderText style={styles.header}>
            ¡Revisa el menu semanal!
          </HeaderText>
          <MenuWeekPicker
            selectedWeek={selectedWeek}
            pressCurrent={() => setSelectedWeek("current")}
            pressNext={() => setSelectedWeek("next")}
          />
          <UnavailableContent
            content="Menú"
            onPressRetry={() => {
              fetchWeekMenu();
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    alignSelf: "center",
  },
  retry: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    marginVertical: 20,
  },
  terms: { textAlign: "center", marginBottom: 20 },
});
