import { icons } from "@/constants/icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.floatingPill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          // Determine Icon and Label based on route name
          let iconSource = icons.home;
          let label = "Home";

          switch (route.name) {
            case "index":
              iconSource = icons.home;
              label = "Home";
              break;
            case "search":
              iconSource = icons.search;
              label = "Search";
              break;
            case "saved":
              iconSource = icons.saved;
              label = "Saved";
              break;
            case "profile":
              iconSource = icons.person;
              label = "Profile";
              break;
            default:
              break;
          }

          return (
            <TabButton
              key={route.key}
              isActive={isFocused}
              onPress={onPress}
              icon={iconSource}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabButton = ({
  isActive,
  onPress,
  icon,
  label,
}: {
  isActive: boolean;
  onPress: () => void;
  icon: any;
  label: string;
}) => {
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isActive ? "#84f906" : "transparent",
      paddingHorizontal: isActive ? 20 : 12,
    };
  }, [isActive]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isActive ? 1 : 0.5) }],
    };
  }, [isActive]);

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      layout={LinearTransition.springify().damping(15).stiffness(120)}
      style={[styles.tabItem, animatedContainerStyle]}
    >
      <Image
        source={icon}
        style={[
          styles.icon,
          {
            tintColor: isActive ? "#000000" : "#888888",
          },
        ]}
        resizeMode="contain"
      />

      {isActive && (
        <Animated.View
          entering={FadeIn.duration(200).springify()}
          exiting={FadeOut.duration(100)}
          style={[styles.labelContainer, animatedTextStyle]}
        >
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </Animated.View>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    zIndex: 100,
  },
  floatingPill: {
    flexDirection: "row",
    backgroundColor: "#111111",
    borderRadius: 40,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
    height: 50,
  },
  icon: {
    width: 24,
    height: 24,
  },
  labelContainer: {
    marginLeft: 8,
    overflow: "hidden",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
  },
});

export default CustomTabBar;
