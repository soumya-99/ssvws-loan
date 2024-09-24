import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import { Text } from "react-native-paper"
import React from 'react'
import { usePaperColorScheme } from '../theme/theme'
import { useNavigation } from '@react-navigation/native'
import HeadingComp from "../components/HeadingComp"
import { loginStorage } from '../storage/appStorage'

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    return (
        <SafeAreaView>
            {/* <ActivityIndicator size={'large'} /> */}
            <ScrollView style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Dashboard" subtitle="Welcome CO!" />
                <View style={{
                    paddingHorizontal: 20,
                    // paddingTop: 10,
                    gap: 8
                }}>
                    <Text variant='bodyLarge'>{JSON.stringify(loginStore)}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})