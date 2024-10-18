import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import React, { useContext, useState } from 'react'
import ButtonPaper from '../components/ButtonPaper'
import InputPaper from '../components/InputPaper'
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import { usePaperColorScheme } from '../theme/theme'
import { AppStore } from '../context/AppContext'

const LoginScreen = () => {
    const theme = usePaperColorScheme()

    const {
        handleLogin,
    } = useContext<any>(AppStore)

    const [username, setUsername] = useState(() => "")
    const [password, setPassword] = useState(() => "")

    // const handleLogin = () => {
    //     console.log("logged in...")
    // }

    const login = () => {
        handleLogin(username, password)
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.surfaceVariant
            }}>
                <View style={{
                    margin: 20,
                    justifyContent: "center",
                    height: SCREEN_HEIGHT,
                }}>

                    <View style={{
                        gap: 10,
                        backgroundColor: theme.colors.background,
                        padding: normalize(30),
                        paddingVertical: normalize(60),
                        borderTopRightRadius: normalize(50),
                        borderBottomLeftRadius: normalize(50)
                    }}>
                        <View>
                            <Text variant='displayMedium' style={{
                                color: theme.colors.primary
                            }}>Login</Text>
                        </View>
                        <InputPaper label='Employee ID' onChangeText={(e: string) => setUsername(e)} value={username} customStyle={{
                            backgroundColor: theme.colors.background
                        }} />
                        <InputPaper label='Password' onChangeText={(e: string) => setPassword(e)} value={password} secureTextEntry customStyle={{
                            backgroundColor: theme.colors.background
                        }} />

                        {/* @ts-ignore */}
                        <ButtonPaper mode='elevated' onPress={login} icon="login" style={{
                            marginTop: normalize(20)
                        }}>
                            Login
                        </ButtonPaper>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})