import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import ButtonPaper from '../components/ButtonPaper'
import { AppStore } from '../context/AppContext'

const SettingsScreen = () => {
    const { handleLogout } = useContext<any>(AppStore)

    const logginOut = () => {
        handleLogout()
    }

    return (
        <View>
            <Text>Settings</Text>
            <ButtonPaper mode='contained' icon="logout" onPress={logginOut}>LOG OUT</ButtonPaper>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})