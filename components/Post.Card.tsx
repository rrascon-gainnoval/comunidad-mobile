import React, { useContext } from "react";

import moment from "moment";
import "moment/locale/es";

import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

import { Container, TextHolder, Text, View, MaterialIcons } from "./Themed";

import { theme } from "../constants/Theme";
import { ThemeContext } from "../Theme.Provider";

type PostProps = {
  date: string;
  message: string;
  displayLikes?: boolean;
  title: string;
  image?: ImageSourcePropType | "";
};

export const PostCard = (props: PostProps) => {
  const { date, message, title, image } = props;
  const { primaryColor } = useContext(ThemeContext);
  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text>{date && moment(date).locale("es-mx").format("LL")}</Text>
        </View>
      </View>
      <TextHolder style={styles.message}>
        <Text>{message}</Text>
      </TextHolder>
      {image && (
        <Image
          style={{ height: image ? 200 : 0 }}
          source={image}
          resizeMode="contain"
        />
      )}
      {props.displayLikes && (
        <View style={styles.bottom}>
          <Text>{`A 5 personas les gusta esto`}</Text>
          <TouchableOpacity style={styles.like} onPress={() => {}}>
            <MaterialIcons
              name={true ? "favorite" : "favorite-border"}
              size={20}
              style={[
                { marginRight: 3 },
                true ? { color: primaryColor } : null,
              ]}
            />
            <Text style={[styles.likeText, true && { color: primaryColor }]}>
              {"Me gusta"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    padding: theme.paddingSm,
  },
  header: {
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    marginBottom: theme.marginY,
  },
  message: {
    marginVertical: theme.marginY,
    padding: theme.paddingSm,
  },
  img: {
    width: "100%",
  },
  bottom: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  like: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 100,
    borderRadius: theme.borderRadius,
  },
  likeText: { fontWeight: "bold" },
});
