import { icons } from "@/constants/icons";
import { usePathname, useRouter } from "expo-router";
import { Dimensions, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 84;
const TAB_COUNT = 4;

const CustomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: icons.home, label: "Home", route: "/(tabs)/index" },
    {
      name: "Search",
      icon: icons.search,
      label: "Search",
      route: "/(tabs)/search",
    },
    {
      name: "Saved",
      icon: icons.saved,
      label: "Saved",
      route: "/(tabs)/saved",
    },
    {
      name: "Profile",
      icon: icons.person,
      label: "Profile",
      route: "/(tabs)/profile",
    },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.route === pathname);

  const getTabWidth = (index: number) => {
    if (activeIndex === -1) return SCREEN_WIDTH / TAB_COUNT;
    if (index === activeIndex) return (SCREEN_WIDTH / TAB_COUNT) * 0.5;

    const remaningWidth = SCREEN_WIDTH * 0.5;
    return remaningWidth / (TAB_COUNT - 1);

  };
  const handleTabPress = (route: string) => {
    router.push(route);
  };
  return (
    <View style={styles.container}>
        <View style={styles.tabBar}>
            {tabs.map((tab, index) => {
                const isActive = index === activeIndex;
                const tabWidth = getTabWidth(index);
                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={[
                            Styles.tab,
                            { width: tabWidth },
                            isActive && Styles.activeTab,
                        ]}
                        onPress={() => handleTabPress(tab.route)}
                        activeOpacity={0.7}
                    >
                        <View 
                         ]}
                );
            })}
        </View>
    </View>
};
