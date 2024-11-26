import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import HomeScreen from "../screens/HomeScreen"
import GroupFormScreen from "../screens/GroupFormScreen"
import BMPendingLoansScreen from '../screens/BMPendingLoansScreen'
import BMPendingLoanFormScreen from '../screens/BMPendingLoanFormScreen'
import GRTFormScreen from '../screens/GRTFormScreen'
import ReportsChooseScreen from '../screens/reports/ReportsChooseScreen'

export default function ReportsNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.reportsChooseScreen} component={ReportsChooseScreen} />

        </Stack.Navigator>
    )
}