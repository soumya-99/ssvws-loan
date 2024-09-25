import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import BMPendingLoansScreen from '../screens/BMPendingLoansScreen'

export default function BMPendingLoansNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.bmPendingLoansScreen} component={BMPendingLoansScreen} />
            {/* <Stack.Screen name={navigationRoutes.groupFormScreen} component={GroupFormScreen} /> */}
            {/* <Stack.Screen
                name={navigationRoutes.productsScreen}
                component={ProductsScreen}
                options={{ animation: "fade_from_bottom" }}
            /> */}

        </Stack.Navigator>
    )
}