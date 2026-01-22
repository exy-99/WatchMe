import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const Tabicon = ({
  icon,
  color,
  name,
  focused,
}: {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}) => {
  return (
    <View className="justify-center items-center gap-1">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      {focused && (
        <Text className="font-semibold text-xs" style={{ color: color }}>
          {name}
        </Text>
      )}
    </View>
  );
};
const Tabslayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#000000",
          height: 840,
        },
      }}
    />
  );
};

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Tabicon
              icon={require("../../assets/icons/home.png")}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Tabicon
              icon={require("../../assets/icons/search.png")}
              color={color}
              name="Search"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Tabicon
              icon={require("../../assets/icons/saved.png")}
              color={color}
              name="Saved"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Tabicon
              icon={require("../../assets/icons/profile.png")}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="movie/[id]"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
};

export default _layout;
