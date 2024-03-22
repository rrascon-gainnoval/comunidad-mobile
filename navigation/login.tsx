import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/Login.Screen";
import { ForgotPasswordScreen } from "../screens/Forgot.Password.Screen";
import { RegisterScreen } from "../screens/Register.Screen";
import { PrivacyTerms } from "../screens/Privacy.Terms";

const Stack = createNativeStackNavigator();

export function LoginNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotPass" component={ForgotPasswordScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Group
          screenOptions={{
            presentation: "modal",
          }}
        >
          <Stack.Screen
            options={{
              title: "",
            }}
            name="PrivacyTerms"
            component={PrivacyTerms}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
