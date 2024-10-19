import { StyleSheet, SafeAreaView, View, ScrollView, RefreshControl } from 'react-native'
import { Text } from "react-native-paper"
import React, { useCallback, useState } from 'react'
import RNRestart from 'react-native-restart'
import { usePaperColorScheme } from '../theme/theme'
import { useNavigation } from '@react-navigation/native'
import HeadingComp from "../components/HeadingComp"
import { loginStorage } from '../storage/appStorage'
import { SCREEN_HEIGHT } from 'react-native-normalize'

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const [refreshing, setRefreshing] = useState(() => false)

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const handleRefresh = () => {
        RNRestart.Restart()
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        handleRefresh()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    return (
        <SafeAreaView>
            {/* <ActivityIndicator size={'large'} /> */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{
                    backgroundColor: theme.colors.background,
                    minHeight: SCREEN_HEIGHT,
                    height: "auto"
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <HeadingComp title="Dashboard" subtitle={`Welcome back ${loginStore?.id === 1 ? "Credit Officer" : "Branch Manager"}!`} />
                <View style={{
                    paddingHorizontal: 20,
                    paddingBottom: 120,
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