import { Pressable, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Text } from "./Themed";
import { theme } from "../constants/Theme";

import { useIsTesting } from "../hooks/useIsTesting";
import { appInfo } from "../app.info";

export function DrawerContent(props: any) {
  const testingUrl = useIsTesting();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Pressable
        style={{ padding: theme.paddingMd }}
        onLongPress={testingUrl.handleLongPress}
        delayLongPress={3000}
      >
        <Text
          style={{
            position: "absolute",
            bottom: theme.marginY * 2,
            alignSelf: "center",
            opacity: 0.3,
            fontWeight: "bold",
          }}
        >
          {`<${testingUrl.isTesting ? "testing" : "beta"} ${
            appInfo.versionNumber
          }> © Innoval`}
        </Text>
      </Pressable>
    </View>
  );
}
