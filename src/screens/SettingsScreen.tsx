import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import ButtonPaper from '../components/ButtonPaper'
import { AppStore } from '../context/AppContext'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'

const SettingsScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const { handleLogout } = useContext<any>(AppStore)

    const logginOut = () => {
        Alert.alert("Logging out", "Are you sure you want to log out?", [{
            text: "NO",
            onPress: () => null
        }, {
            text: "YES",
            onPress: () => handleLogout()
        }])
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Settings" subtitle="Manage Settings" />
                <View style={{
                    paddingHorizontal: 20,
                    minHeight: SCREEN_HEIGHT,
                    height: "auto"
                }}>
                    <ButtonPaper mode='contained' icon="logout" onPress={logginOut}>LOG OUT</ButtonPaper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})