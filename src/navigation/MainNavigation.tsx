import React, { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/LoginScreen"
import navigationRoutes from "../routes/routes"
// import { AppStore } from "../context/AppContext"
import { NavigationContainer } from "@react-navigation/native"
import BottomNavigationPaper from "./BottomNavigationPaper"
import NoInternetScreen from "../screens/NoInternetScreen.tsx"
import { useNetInfo } from "@react-native-community/netinfo"
// import { AppStoreContext } from "../models/custom_types"

export default function MainNavigation() {
    const Stack = createNativeStackNavigator()
    const { isConnected } = useNetInfo()
    console.log("NET INFOOOOOOO", isConnected)

    // const { isLogin } = useContext(AppStore)
    var isLogin = true

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{ headerShown: false, animation: "simple_push" }}>
                    {isLogin ? (
                        isConnected ? (
                            <>
                                <Stack.Screen
                                    name={navigationRoutes.bottomNavigationPaper}
                                    component={BottomNavigationPaper}
                                />
                                {/* <Stack.Screen
                name={navigationRoutes.homeNavigation}
                component={HomeNavigation}
              />
              <Stack.Screen
                name={navigationRoutes.settingsNavigation}
                component={SettingsNavigation}
              /> */}
                            </>
                        ) : (
                            <Stack.Screen
                                name={navigationRoutes.noInternetScreen}
                                component={NoInternetScreen}
                            />
                        )
                    ) : isConnected ? (
                        <>
                            <Stack.Screen
                                name={navigationRoutes.login}
                                component={LoginScreen}
                            />
                            {/* <Stack.Screen
                  name={navigationRoutes.register}
                  component={RegisterScreen}
                />
                <Stack.Screen
                  name={navigationRoutes.createPinScreen}
                  component={CreatePinScreen}
                />
                <Stack.Screen
                  name={navigationRoutes.forgotPinScreen}
                  component={ForgotPinScreen}
                /> */}
                        </>
                    ) : (
                        <Stack.Screen
                            name={navigationRoutes.noInternetScreen}
                            component={NoInternetScreen}
                        />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}