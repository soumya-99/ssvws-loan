import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import SearchScreen from '../screens/SearchScreen'
import SearchByGroupScreen from '../screens/SearchByGroupScreen'
import COGroupFormExtendedScreen from '../screens/COGroupFormExtendedScreen'
import SearchByMemberScreen from '../screens/SearchByMemberScreen'
import MemberDetailsAllFormScreen from '../screens/MemberDetailsAllFormScreen'

export default function SearchNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.searchScreen} component={SearchScreen} />
            <Stack.Screen name={navigationRoutes.searchByGroupScreen} component={SearchByGroupScreen} />
            <Stack.Screen name={navigationRoutes.coGroupFormExtendedScreen} component={COGroupFormExtendedScreen} />
            <Stack.Screen name={navigationRoutes.searchByMemberScreen} component={SearchByMemberScreen} />
            <Stack.Screen name={navigationRoutes.memberDetailsAllFormScreen} component={MemberDetailsAllFormScreen} />
        </Stack.Navigator>
    )
}