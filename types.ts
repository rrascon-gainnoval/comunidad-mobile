/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Suggestions: undefined;
  SatisfactionSurvey: undefined;
  Login: undefined;
  Splash: undefined;
  EmojiPicker: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  TabHome: undefined;
  TabTrivia: undefined;
  TabMenu: undefined;
  TabAdvertise: undefined;
  TabWallet: undefined;
  TabAppointment: undefined;
  TabSocial: undefined;
  TabEvents: undefined;
};

export type DrawerParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    CompositeScreenProps<
      NativeStackScreenProps<RootStackParamList>,
      DrawerScreenProps<DrawerParamList>
    >
  >;

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  second_lastname: string;
  birth_date: string;
  icon: string;
  coins: number;
  xp: number;
}

export type Advertise = {
  id: number;
  title: string;
  body: string;
  colorSet: number;
  start_date: string;
  end_date: string;
  image: string | null;
  url: string | null;
  type: string | null;
};

export type AdvertiseReelProps = {
  advertises: Advertise[];
};

export type colorSet = 'primary' | 'secondary' | 'tertiary';

export type AdvertiseWithColorSet = {
  id: number;
  title: string;
  description: string;
  colorSet: colorSet;
};

export type LoaderProps = {
  size?: 'small' | 'large';
  style?: {};
};

export interface TriviaQuestion {
  id: string;
  text: string;
  incorrect_answer_1: string;
  incorrect_answer_2: string;
  incorrect_answer_3: string;
  correct_answer: string;
}

export interface Trivia {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  fields: string[];
  questions: TriviaQuestion[];
  points_to_win: number;
  is_completed: boolean;
  type: 'normal' | 'training';
}

export type TriviaCardProps = {
  title: string;
  description: string;
  points: number;
  quiz: TriviaQuestion[];
  done: boolean;
  handlePress: () => void;
};
export type TriviaResult = {
  text: string;
  is_correct: boolean;
  question: TriviaQuestion;
};

export type CategoryFilterType = {
  name: string;
  icon: string;
};

export type PayrollDetails = {
  code: string;
  net_pay: string;
  total_deduction: string;
  total_perception: string;
  errorCode: number | null;
};

export type Appointment = {
  consultorio: string;
  fecha: string;
  hora: string;
  id_cita: string;
};

export type prevAppointment = {
  fecha: string;
  identificador: string;
};

export type Visit = {
  medico: {
    citas: Appointment[];
    historial: prevAppointment[];
  };
  dental: {
    citas: Appointment[];
    historial: prevAppointment[];
  };
  token: string;
};

export interface Inbox {
  sourceName: string;
  message: string;
}

export interface Language {
  id: string;
  name: string;
}

interface Phrase {
  id: string;
  language: Language;
  phrase: string;
  audio: string;
}

export interface Translation {
  id: string;
  first_phrase: Phrase;
  second_phrase: Phrase;
}

export interface EventImage {
  id: string;
  image: string;
}

export interface Event {
  id: string;
  gallery: EventImage[];
  title: string;
  body: string;
  image: string | null;
  start_date: string;
  end_date: string;
  place: string;
  spots: number;
  is_unlimited: boolean;
  fields: string[];
  type: 'Tournament' | 'Event';
  is_user_signed_up: boolean;
  attendees: number;
}

export interface SocialPost {
  id: string;
  date_created: string;
  body: string;
  user: User;
  is_liked: boolean;
  user_like_id: string;
  likes: number;
  image: string;
}

export interface BirthDay {
  id: string;
  first_name: string;
  last_name: string;
  icon: string;
  likes: number;
  is_liked: boolean;
}

export interface VotingChoice {
  id: string;
  text: string;
  image: string;
  votes: number;
}

export interface Voting {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  voted: boolean;
  choices: VotingChoice[];
}

export interface Achievment {
  id: string;
  title: string;
  description: string;
  objective: number;
  points: number;
  category: string;
}

export interface UserAchievment {
  id: string;
  seen: boolean;
  completed: boolean;
  progress: number;
  achievement: Achievment;
}
