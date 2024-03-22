import { useContext } from "react";
import { FlatList, View, StyleSheet, Image } from "react-native";

import * as Layout from "../constants/Layout";
import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";
import { Text, TextHolder } from "./Themed";

const layout = Layout.default;
const width = layout.window.width;
const isSmallDevice = layout.isSmallDevice;

type RankingReelProps = {
  ranking: any[];
};

const medals = [
  require("../assets/images/medal_gold.png"),
  require("../assets/images/medal_silver.png"),
  require("../assets/images/medal_bronze.png"),
];

export const RankingReel = (props: RankingReelProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <View>
      <FlatList
        style={{
          height: 160,
          marginLeft: theme.marginX,
          marginVertical: theme.marginY,
        }}
        horizontal={true}
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - (isSmallDevice ? 55 : 100)}
        data={props.ranking}
        keyExtractor={(item) => item.user}
        renderItem={({ item, index }) => (
          <TextHolder style={styles.card} key={Math.random()}>
            <Image style={styles.image} source={medals[index]} />
            <Text
              style={styles.title}
            >{`${item.nombre} ${item.aPaterno}`}</Text>
            <View>
              <View style={styles.holder}>
                <Text>
                  <Text style={{ color: primaryColor }}>
                    {item.puntos_acumulados}
                  </Text>
                </Text>
              </View>
            </View>
          </TextHolder>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 15,
    padding: theme.paddingSm,
    justifyContent: "center",
    alignItems: "center",
    width: 160,
    borderRadius: theme.borderRadius,
  },
  title: {
    fontWeight: "bold",
    marginVertical: 10,
  },
  points: {
    fontWeight: "bold",
  },
  image: {
    width: 50,
    height: 50,
  },
  holder: {
    padding: theme.paddingSm,
    borderRadius: theme.borderRadius,
  },
});
