import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeacherTabNavigator from "./TeacherTabNavigator";
import EventDetailsScreen from "../screens/Teacher/EventDetailsScreen"; // --- IMPORT NEW SCREEN ---
import { TeacherTabParamList } from "./types";

// Combine tab param list with stack-specific screens
export type TeacherStackParamList = TeacherTabParamList & {
  TeacherTabs: undefined;
};

const Stack = createNativeStackNavigator<TeacherStackParamList>();

const TeacherNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="TeacherTabs"
    >
      <Stack.Screen name="TeacherTabs" component={TeacherTabNavigator} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;
