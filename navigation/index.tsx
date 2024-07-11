/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { Platform, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import ModalScreen from '../screens/Modal.Screen';
import NotFoundScreen from '../screens/NotFound.Screen';

import { TabHomeScreen } from '../screens/Tab.Home.Screen';
import { TabTriviaScreen } from '../screens/Tab.Trivia.Screen';
import { TriviaResultScreen } from '../screens/Trivia.Result.Screen';
import { QuizScreen } from '../screens/Trivia.Quiz.Screen';

import { SocialHomeScreen } from '../screens/Social.Home.Screen';
import { ProfileScreen } from '../screens/Profile.Screen';
import { TabWalletScreen } from '../screens/Tab.Wallet.Screen';
import { SuggestionsScreen } from '../screens/Suggestions.Survey.Screen';
import { SatisfactionScreen } from '../screens/Satisfaction.Survey.Screen';
import { ChestScreen } from '../screens/Chest.Screen';
import { RankingHome } from '../screens/Ranking.Screen';

import { RootStackParamList, RootTabParamList } from '../types';
import { AppointmentMenuScreen } from '../screens/Appointment.Menu.Screen';
import { AppointmentScreen } from '../screens/Appointment.Screen';
import { AppointmentConfirmScreen } from '../screens/Appointment.Confirm.Screen';
import { DictionaryHomeScreen } from '../screens/Dictionary.Home.Screen';
import { EventsHomeScreen } from '../screens/Events.Home.Screen';
import { EventDetailsScreen } from '../screens/Event.Details.Screen';
import { GalleryScreen } from '../screens/Gallery.Screen';
import { ChangePasswordScreen } from '../screens/Change.Password.Screen';
import { VotingHomeSrcreen } from '../screens/Voting.Home.Screen';
import { VotingDetailsScreen } from '../screens/Voting.Details.Screen';
import { ChatbotScreen } from '../screens/Chatbot.Screen';
import { PreferencesScreen } from '../screens/Preferences.Screen';
import { ThemeContext } from '../Theme.Provider';
import { DrawerContent } from '../components/Drawer.Content';
import { EventEnrollTeam } from '../screens/Event.Enroll.Team';
import { EventTeams } from '../screens/Event.Teams';
import { DigitalBadge } from '../screens/Digital.Badge';
import { OnboardingScreen } from '../screens/Onboarding.Screen';
import { AchievmentsScreen } from '../screens/Achievments.Screen';
import { StoreProductsScreen } from '../screens/Store.Products.Screen';
import { NominaHomeScreen } from '../screens/Nomina.Home.Screen';
import { AppointmentVisitDetails } from '../screens/Appointment.Visit.Details';
import { PodcastHomeScreen } from '../screens/Podcast.Home.Screen';
import { WalletSignature } from '../screens/Wallet.Signature.Screen';
import { WalletCreatePin } from '../screens/Wallet.CreatePin';
import { WalletModifyPin } from '../screens/Wallet.ModifyPin.Screen';

export default function Navigation() {
  const { appTheme } = React.useContext(ThemeContext);
  return (
    <NavigationContainer theme={appTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DrawerNavigator />
      <StatusBar style={appTheme === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

/**
 * A drawer navigator renders a navigation drawer which can be opened and closed via gestures.
 * https://reactnavigation.org/docs/drawer-navigator/
 */
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { appTheme, primaryColor } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: primaryColor,
        drawerLabelStyle: {
          fontSize: 16,
        },
        headerTintColor: Colors[appTheme].text,
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={RootNavigator}
        options={{
          headerShown: false,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="home"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="Eventos"
        component={EventsNavigator}
        options={{
          headerShadowVisible: false,
          headerShown: false,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="calendar-star"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="Podcast"
        component={PodcastHomeScreen}
        options={{
          headerShadowVisible: false,
          headerShown: true,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="microphone"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="Diccionario"
        component={DictionaryHomeScreen}
        options={{
          headerShadowVisible: false,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />

      <Drawer.Screen
        name="Productos tienda"
        component={StoreProductsScreen}
        options={{
          headerShadowVisible: false,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="cart"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="Credencial"
        component={DigitalBadge}
        options={{
          headerShadowVisible: false,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="badge-account-horizontal"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="Ayuda"
        component={ChatbotScreen}
        options={{
          headerShadowVisible: false,
          drawerIcon: (props) => {
            return (
              <MaterialCommunityIcons
                name="chat-question"
                size={24}
                color={props.color}
              />
            );
          },
        }}
      />
    </Drawer.Navigator>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: 'Oops!' }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="Suggestions"
          component={SuggestionsScreen}
          options={{ title: 'Sugerencias', headerShadowVisible: false }}
        />
        <Stack.Screen
          name="SatisfactionSurvey"
          component={SatisfactionScreen}
          options={{ title: '', headerShadowVisible: false }}
        />
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileNavigator() {
  const { appTheme } = useContext(ThemeContext);

  return (
    <ProfileStack.Navigator
      screenOptions={{ headerShadowVisible: false }}
      initialRouteName="Profile"
    >
      <ProfileStack.Screen
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Perfil',
          headerLeft: () => {
            return (
              <Pressable
                style={{
                  marginRight: 16,
                  paddingRight: 16,
                  paddingVertical: 16,
                }}
                onPress={() => {
                  navigation.openDrawer();
                }}
              >
                <MaterialCommunityIcons
                  name="menu"
                  size={24}
                  color={Colors[appTheme].text}
                />
              </Pressable>
            );
          },
        })}
        name="Profile"
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        options={{ title: '' }}
        name="ChangePass"
        component={ChangePasswordScreen}
      />
      <ProfileStack.Screen
        options={{ title: 'Logros' }}
        name="Achievments"
        component={AchievmentsScreen}
      />
      <ProfileStack.Screen
        options={{ title: 'Preferencias' }}
        name="Preferences"
        component={PreferencesScreen}
      />
      <ProfileStack.Screen
        options={{ title: 'Credencial digital' }}
        name="DigitalBadge"
        component={DigitalBadge}
      />
    </ProfileStack.Navigator>
  );
}

const TriviaStack = createNativeStackNavigator();

function TriviaNavigator() {
  const { appTheme } = useContext(ThemeContext);

  return (
    <TriviaStack.Navigator initialRouteName="TriviaScreenHome">
      <TriviaStack.Screen
        name="TriviaScreenHome"
        component={TabTriviaScreen}
        options={({ navigation }: any) => ({
          title: 'Trivias',
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginRight: 16,
                paddingRight: 16,
                paddingVertical: 16,
              })}
            >
              <FontAwesome5
                name="bars"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
        })}
      />
      <TriviaStack.Screen
        name="TriviaScreenQuiz"
        component={QuizScreen}
        options={({ route }: any) => ({
          title: route.params.title ? route.params.title : 'Trivia',
          headerBackVisible: false,
          headerShadowVisible: false,
        })}
      />
      <TriviaStack.Screen
        name="TriviaResult"
        component={TriviaResultScreen}
        options={{ headerShown: false }}
      />
    </TriviaStack.Navigator>
  );
}

const AppointmentStack = createNativeStackNavigator();

function AppointmentNavigator() {
  return (
    <AppointmentStack.Navigator>
      <AppointmentStack.Screen
        name="AppointmentMenu"
        component={AppointmentMenuScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppointmentStack.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{
          headerShown: false,
          headerBackTitle: 'Volver',
          headerShadowVisible: false,
          title: '',
        }}
      />
      <AppointmentStack.Group screenOptions={{ presentation: 'modal' }}>
        <AppointmentStack.Screen
          name="AppointmentConfirm"
          component={AppointmentConfirmScreen}
          options={{
            title: 'Confirmación',
            headerShown: Platform.OS === 'ios' ? true : false,
          }}
        />
        <AppointmentStack.Screen
          name="VisitDetails"
          component={AppointmentVisitDetails}
          options={{
            title: 'Detalles',
            headerShown: Platform.OS === 'ios' ? true : false,
          }}
        />
      </AppointmentStack.Group>
    </AppointmentStack.Navigator>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeNavigation() {
  const { appTheme } = useContext(ThemeContext);

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={TabHomeScreen}
        options={({ navigation }: any) => ({
          title: 'Inicio',
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginRight: 16,
                paddingRight: 16,
                paddingVertical: 16,
              })}
            >
              <FontAwesome5
                name="bars"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('RewardHome')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                paddingLeft: 16,
                paddingVertical: 16,
              })}
            >
              <FontAwesome5
                name="coins"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
        })}
      />
      <HomeStack.Screen
        name="RewardHome"
        component={ChestScreen}
        options={{
          title: 'Recompensas',
          headerShadowVisible: false,
          headerShown: true,
        }}
      />
      <HomeStack.Screen
        name="RankingHome"
        component={RankingHome}
        options={{
          title: 'Puntuaciones',
          headerShadowVisible: false,
          headerShown: true,
        }}
      />
      <HomeStack.Screen
        name="VotingDetails"
        component={VotingDetailsScreen}
        options={{
          title: '',
          headerShadowVisible: false,
          headerShown: true,
        }}
      />
      <HomeStack.Screen
        name="VotingHome"
        component={VotingHomeSrcreen}
        options={{
          title: 'Encuestas y votaciones',
          headerShadowVisible: false,
          headerShown: true,
        }}
      />

      <HomeStack.Group screenOptions={{ presentation: 'modal' }}>
        <HomeStack.Screen
          name="NominaHome"
          component={NominaHomeScreen}
          options={{
            title: '',
            headerShown: true,
          }}
        />
      </HomeStack.Group>

      <HomeStack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="Onboarding"
          component={OnboardingScreen}
        />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

const WalletStack = createNativeStackNavigator();

function WalletNavigator() {
  const { appTheme } = useContext(ThemeContext);

  return (
    <WalletStack.Navigator initialRouteName="WalletHome">
      <WalletStack.Screen
        name="WalletHome"
        component={TabWalletScreen}
        options={({ navigation }: any) => ({
          title: 'Crédito',
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginRight: 16,
                paddingRight: 16,
                paddingVertical: 16,
              })}
            >
              <FontAwesome5
                name="bars"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
        })}
      />
      <WalletStack.Screen
        name="WalletCreate"
        component={WalletCreatePin}
        options={{
          title: 'Activar Crédito',
          headerShadowVisible: false,
        }}
      />
      <WalletStack.Group>
        <WalletStack.Screen
          name="WalletModify"
          component={WalletModifyPin}
          options={{
            title: 'Modificar PIN',
            headerShadowVisible: false,
          }}
        />
      </WalletStack.Group>
    </WalletStack.Navigator>
  );
}

const EventsStack = createNativeStackNavigator();

function EventsNavigator() {
  const { appTheme } = useContext(ThemeContext);

  return (
    <EventsStack.Navigator initialRouteName="EventsHome">
      <EventsStack.Screen
        name="EventsHome"
        component={EventsHomeScreen}
        options={({ navigation }: any) => ({
          title: 'Eventos',
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginRight: 16,
                paddingRight: 16,
                paddingVertical: 16,
              })}
            >
              <FontAwesome5
                name="bars"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
        })}
      />
      <EventsStack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{
          title: 'Detalles',
          headerShadowVisible: false,
        }}
      />
      <EventsStack.Screen
        name="EventTeams"
        component={EventTeams}
        options={{
          title: 'Equipos',
          headerShadowVisible: false,
        }}
      />
      <EventsStack.Screen
        name="EventGallery"
        component={GalleryScreen}
        options={{
          title: 'Galeria',
          headerShadowVisible: false,
        }}
      />
      <EventsStack.Group screenOptions={{ presentation: 'modal' }}>
        <EventsStack.Screen
          name="EventEnrollTeam"
          component={EventEnrollTeam}
          options={{
            title: 'Inscribir equipo',
            headerShadowVisible: false,
          }}
        />
      </EventsStack.Group>

      {/* <EventsStack.Group></EventsStack.Group> */}
    </EventsStack.Navigator>
  );
}

// const SocialBottomTab = createBottomTabNavigator<RootTabParamList>();

// function SocialBottomTabNavigator() {
//   const { appTheme, primaryColor } = useContext(ThemeContext);

//   return (
//     <SocialBottomTab.Navigator
//       initialRouteName="TabSocial"
//       screenOptions={{
//         tabBarActiveTintColor: primaryColor,
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           borderTopWidth: 0,
//         },
//         headerStyle: {
//           elevation: 0,
//           shadowOpacity: 0,
//           borderWidth: 0,
//         },
//         unmountOnBlur: true,
//       }}
//     >
//       <SocialBottomTab.Screen
//         name="TabSocial"
//         component={SocialHomeScreen}
//         options={({ navigation }: any) => ({
//           title: "Social",
//           tabBarIcon: ({ color }) => <TabBarIcon name="earth" color={color} />,
//           headerLeft: () => (
//             <Pressable
//               onPress={() => navigation.openDrawer()}
//               style={({ pressed }) => ({
//                 opacity: pressed ? 0.5 : 1,
//                 marginLeft: 16,
//               })}
//             >
//               <FontAwesome5
//                 name="bars"
//                 size={20}
//                 color={Colors[appTheme].text}
//               />
//             </Pressable>
//           ),
//         })}
//       />
//       <SocialBottomTab.Screen
//         name="TabEvents"
//         component={EventsNavigator}
//         options={{
//           title: "Eventos",
//           headerShown: false,
//           unmountOnBlur: true,
//           tabBarIcon: ({ color }) => (
//             <TabBarIcon name="calendar-star" color={color} />
//           ),
//         }}
//       />
//     </SocialBottomTab.Navigator>
//   );
// }

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const { appTheme, primaryColor } = useContext(ThemeContext);

  return (
    <BottomTab.Navigator
      initialRouteName="TabHome"
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderWidth: 0,
        },
        // unmountOnBlur: true,
      }}
    >
      <BottomTab.Screen
        name="TabHome"
        component={HomeNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabTrivia"
        component={TriviaNavigator}
        options={{
          // unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="head-question" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TabSocial"
        component={SocialHomeScreen}
        options={({ navigation }: any) => ({
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="account-heart" color={color} />
          ),

          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 16,
                paddingRight: 10,
                paddingVertical: 10,
              })}
            >
              <FontAwesome5
                name="bars"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
        })}
      />

      {/* <BottomTab.Screen
        name="TabMenu"
        component={TabMenuScreen}
        options={({ navigation }: any) => ({
          title: "Menus",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="silverware-fork-knife" color={color} size={28} />
          ),

          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 16,
                paddingRight: 16,
                paddingVertical: 16,
              })}
            >
              <FontAwesome5
                name="bars"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
        })}
      /> */}
      <BottomTab.Screen
        name="TabAppointment"
        component={AppointmentNavigator}
        options={({ navigation }: any) => ({
          title: 'Agendar',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="book" color={color} size={25} />
          ),

          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 16,
                paddingRight: 10,
                paddingVertical: 10,
              })}
            >
              <FontAwesome5
                name="bars"
                size={20}
                color={Colors[appTheme].text}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabWallet"
        component={WalletNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="wallet" color={color} size={28} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>['name'];
  color: string;
  size?: number;
}) {
  return (
    <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />
  );
}
