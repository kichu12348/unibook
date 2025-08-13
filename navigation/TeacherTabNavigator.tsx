// navigation/TeacherTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabNavigator from "../components/CustomTabNavigator";
import ProfileScreen from "../screens/SuperAdmin/ProfileScreen";
import MyEventsScreen from "../screens/Teacher/MyEventsScreen"; // Import screen
import { TeacherTabParamList } from "./types"; // Import type

// Use the type you created earlier
const Tab = createBottomTabNavigator<TeacherTabParamList>();

const tabs = [
  {
    name: "MyEvents" as const,
    label: "Events",
    icon: "calendar" as const,
    iconOutline: "calendar-outline" as const,
  },
  {
    name: "Profile" as const,
    label: "Profile",
    icon: "person" as const,
    iconOutline: "person-outline" as const,
  },
];

const TeacherTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomTabNavigator {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="MyEvents" component={MyEventsScreen} />
      {/* <Tab.Screen name="Requests" component={RequestsScreen} /> */}
      {/* <Tab.Screen name="MyEvents" component={MyEventsScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TeacherTabNavigator;
