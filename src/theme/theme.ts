import { Platform, useColorScheme } from "react-native"
import { MD3LightTheme, MD3DarkTheme, configureFonts } from "react-native-paper"

export const usePaperColorScheme = () => {
    const colorScheme = useColorScheme()

    const fontConfig = {
        // default: {
        //     fontFamily: "WorkSans-VariableFont_wght"
        // }
    }
    // const fontConfig = {
    //     default: {
    //         fontFamily: "ProductSans-Medium",
    //     },
    //     labelSmall: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 15,
    //     },
    //     labelMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 15,
    //     },
    //     labelLarge: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 15,
    //     },
    //     titleLarge: {
    //         fontFamily: "ProductSans-Bold",
    //         fontSize: 20,
    //     },
    //     bodyMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 17,
    //     },
    //     bodyLarge: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 17,
    //     },
    //     displayMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 40,
    //     },
    //     displaySmall: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 35,
    //     },
    //     headlineMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 20,
    //     },
    //     headlineLarge: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 24,
    //     },
    // }

    return colorScheme === "dark"
        ? {
            ...MD3DarkTheme,
            "colors": {
                ...MD3DarkTheme.colors,
                "primary": "rgb(135, 206, 255)",
                "onPrimary": "rgb(0, 52, 77)",
                "primaryContainer": "rgb(0, 76, 109)",
                "onPrimaryContainer": "rgb(200, 230, 255)",
                "secondary": "rgb(183, 201, 216)",
                "onSecondary": "rgb(33, 50, 63)",
                "secondaryContainer": "rgb(56, 73, 86)",
                "onSecondaryContainer": "rgb(210, 229, 245)",
                "tertiary": "rgb(205, 192, 232)",
                "onTertiary": "rgb(52, 43, 75)",
                "tertiaryContainer": "rgb(75, 65, 99)",
                "onTertiaryContainer": "rgb(233, 221, 255)",
                "error": "rgb(255, 180, 171)",
                "onError": "rgb(105, 0, 5)",
                "errorContainer": "rgb(147, 0, 10)",
                "onErrorContainer": "rgb(255, 180, 171)",
                "background": "rgb(25, 28, 30)",
                "onBackground": "rgb(226, 226, 229)",
                "surface": "rgb(25, 28, 30)",
                "onSurface": "rgb(226, 226, 229)",
                "surfaceVariant": "rgb(65, 72, 77)",
                "onSurfaceVariant": "rgb(193, 199, 206)",
                "outline": "rgb(139, 145, 152)",
                "outlineVariant": "rgb(65, 72, 77)",
                "shadow": "rgb(0, 0, 0)",
                "scrim": "rgb(0, 0, 0)",
                "inverseSurface": "rgb(226, 226, 229)",
                "inverseOnSurface": "rgb(46, 49, 51)",
                "inversePrimary": "rgb(0, 101, 144)",
                "elevation": {
                    "level0": "transparent",
                    "level1": "rgb(31, 37, 41)",
                    "level2": "rgb(34, 42, 48)",
                    "level3": "rgb(37, 48, 55)",
                    "level4": "rgb(38, 49, 57)",
                    "level5": "rgb(40, 53, 62)"
                },
                "surfaceDisabled": "rgba(226, 226, 229, 0.12)",
                "onSurfaceDisabled": "rgba(226, 226, 229, 0.38)",
                "backdrop": "rgba(43, 49, 54, 0.4)"
            },
            fonts: configureFonts({ config: fontConfig }),
        }
        : {
            ...MD3LightTheme,
            "colors": {
                ...MD3LightTheme.colors,
                "primary": "rgb(0, 101, 144)",
                "onPrimary": "rgb(255, 255, 255)",
                "primaryContainer": "rgb(200, 230, 255)",
                "onPrimaryContainer": "rgb(0, 30, 46)",
                "secondary": "rgb(79, 96, 110)",
                "onSecondary": "rgb(255, 255, 255)",
                "secondaryContainer": "rgb(210, 229, 245)",
                "onSecondaryContainer": "rgb(11, 29, 41)",
                "tertiary": "rgb(99, 89, 124)",
                "onTertiary": "rgb(255, 255, 255)",
                "tertiaryContainer": "rgb(233, 221, 255)",
                "onTertiaryContainer": "rgb(31, 22, 53)",
                "error": "rgb(186, 26, 26)",
                "onError": "rgb(255, 255, 255)",
                "errorContainer": "rgb(255, 218, 214)",
                "onErrorContainer": "rgb(65, 0, 2)",
                "background": "rgb(252, 252, 255)",
                "onBackground": "rgb(25, 28, 30)",
                "surface": "rgb(252, 252, 255)",
                "onSurface": "rgb(25, 28, 30)",
                "surfaceVariant": "rgb(221, 227, 234)",
                "onSurfaceVariant": "rgb(65, 72, 77)",
                "outline": "rgb(113, 120, 126)",
                "outlineVariant": "rgb(193, 199, 206)",
                "shadow": "rgb(0, 0, 0)",
                "scrim": "rgb(0, 0, 0)",
                "inverseSurface": "rgb(46, 49, 51)",
                "inverseOnSurface": "rgb(240, 240, 243)",
                "inversePrimary": "rgb(135, 206, 255)",
                "elevation": {
                    "level0": "transparent",
                    "level1": "rgb(239, 244, 249)",
                    "level2": "rgb(232, 240, 246)",
                    "level3": "rgb(224, 235, 243)",
                    "level4": "rgb(222, 234, 242)",
                    "level5": "rgb(217, 231, 240)"
                },
                "surfaceDisabled": "rgba(25, 28, 30, 0.12)",
                "onSurfaceDisabled": "rgba(25, 28, 30, 0.38)",
                "backdrop": "rgba(43, 49, 54, 0.4)"
            },
            fonts: configureFonts({ config: fontConfig }),
        }
}