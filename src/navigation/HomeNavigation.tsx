import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import HomeScreen from "../screens/HomeScreen"
import GroupFormScreen from "../screens/GroupFormScreen"

export default function HomeNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.homeScreen} component={HomeScreen} />
            {/* <Stack.Screen name={navigationRoutes.groupFormScreen} component={GroupFormScreen} /> */}
            {/* <Stack.Screen
                name={navigationRoutes.productsScreen}
                component={ProductsScreen}
                options={{ animation: "fade_from_bottom" }}
            /> */}

        </Stack.Navigator>
    )
}