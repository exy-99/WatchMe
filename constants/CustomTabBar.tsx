import { icons } from "@/constants/icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname, useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 84;
const TAB_COUNT = 4;

type TabRoute =
  | "/(tabs)/index"
  | "/(tabs)/search"
  | "/(tabs)/saved"
  | "/(tabs)/profile";

interface TabItem {
  name: string;
  icon: any;
  label: string;
  route: TabRoute;
  key: string;
}

const CustomTabBar = (props: BottomTabBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabItem[] = [
    {
      name: "Home",
      icon: icons.home,
      label: "Home",
      route: "/(tabs)/index",
      key: "home",
    },
    {
      name: "Search",
      icon: icons.search,
      label: "Search",
      route: "/(tabs)/search",
      key: "search",
    },
    {
      name: "Saved",
      icon: icons.saved,
      label: "Saved",
      route: "/(tabs)/saved",
      key: "saved",
    },
    {
      name: "Profile",
      icon: icons.person,
      label: "Profile",
      route: "/(tabs)/profile",
      key: "profile",
    },
  ];

  const activeIndex = tabs.findIndex((tab) => {
    if (tab.key === "home") {
      return (
        pathname === "/" ||
        pathname === "/index" ||
        pathname === "/(tabs)/index" ||
        pathname === "/(tabs)"
      );
    }
    return pathname === tab.route || pathname.startsWith(tab.route);
  });

  const getTabWidth = (index: number) => {
    if (activeIndex === -1) return SCREEN_WIDTH / TAB_COUNT;

    if (index === activeIndex) return SCREEN_WIDTH * 0.5;

    const remainingWidth = SCREEN_WIDTH * 0.5;
    return remainingWidth / (TAB_COUNT - 1);
  };

  const handleTabPress = (route: TabRoute) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          const tabWidth = getTabWidth(index);

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                { width: tabWidth },
                isActive && styles.activeTab,
              ]}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Image
                  source={tab.icon}
                  style={[
                    styles.icon,
                    {
                      tintColor: isActive ? "#000000" : "#CDCDE0",
                    },
                  ]}
                  resizeMode="contain"
                />

                {isActive && (
                  <View style={styles.labelContainer}>
                    <Text style={styles.label} numberOfLines={1}>
                      {tab.label}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E0E0E0",
    borderTopWidth: 0.5,
    paddingBottom: 20,
  },
  tabBar: {
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    alignItems: "center",
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  activeTab: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  labelContainer: {
    overflow: "hidden",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
});

export default CustomTabBar;
