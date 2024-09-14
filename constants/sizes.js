import { Dimensions } from "react-native";
import Constants from "expo-constants";

const {width, height} = Dimensions.get("window");

export default {
    vw: width,
    vh: height,
    statusBarHeight: Constants.statusBarHeight,

    textXSmall: 10,
    textSmall: 12,
    textMedium: 14,
    textLarge: 16,

    titleSmall: 16,
    titleMedium: 18,
    titleLarge: 20,
    titleXLarge: 22,
    titleXXLarge: 24,
    title3XLarge: 26,
    title4XLarge: 28,
    title5XLarge: 30,
    title6XLarge: 32,

    screenPaddingHorizontal: 20,
    screenPaddingVertical: 20,
};