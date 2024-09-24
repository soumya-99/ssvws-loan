import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import ButtonPaper from '../components/ButtonPaper'
import { AppStore } from '../context/AppContext'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'

const SettingsScreen = () => {
    const navigation = useNavigation()
    const { handleLogout } = useContext<any>(AppStore)

    const logginOut = () => {
        handleLogout()
    }

    return (
        <View style={{
            padding: 20
        }}>
            <Text>Settings</Text>
            <ButtonPaper mode='contained' icon="logout" onPress={logginOut}>LOG OUT</ButtonPaper>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})