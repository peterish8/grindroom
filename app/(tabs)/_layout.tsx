import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Users, PlusSquare, User } from "lucide-react-native";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111111",
          borderTopWidth: 1,
          borderTopColor: "#1E1E1E",
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#C8F135",
        tabBarInactiveTintColor: "#3A3A3A",
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: "Inter_700Bold",
          letterSpacing: 0.4,
          marginTop: 2,
          textTransform: "uppercase",
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: "Rooms",
          tabBarIcon: ({ color, size }) => <Users size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color, size }) => <PlusSquare size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
