import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const TabIcon = ({
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
    <View className=" flex-row justify-center items-center gap-1 ">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-7 h-7"
      />
      {focused && (
        <Text
          className={`font-semibold text-xs ${focused ? "" : "opacity-0"}`}
          style={{ color: color }}
          numberOfLines={1}
        >
          {name}
        </Text>
      )}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0.5,
          borderTopColor: "#000000",
          height: 95,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
          tabBarItemStyle: {
            width: "25%",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.search}
              color={color}
              name="Search"
              focused={focused}
            />
          ),
          tabBarItemStyle: {
            width: "25%",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.saved}
              color={color}
              name="Saved"
              focused={focused}
            />
          ),
          tabBarItemStyle: {
            width: "25%",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.person}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
          tabBarItemStyle: {
            width: "25%",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
