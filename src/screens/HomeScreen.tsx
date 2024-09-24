import { StyleSheet, SafeAreaView, View, ScrollView, Alert, ToastAndroid } from 'react-native'
import { List, Text, Divider, ActivityIndicator, TouchableRipple } from "react-native-paper"
import React, { useEffect, useState } from 'react'
import { formattedDate } from "../utils/dateFormatter"
import InputPaper from "../components/InputPaper"
import ButtonPaper from "../components/ButtonPaper"
import { usePaperColorScheme } from '../theme/theme'
import DatePicker from "react-native-date-picker"
import MenuPaper from "../components/MenuPaper"
import axios from "axios"
import { ADDRESSES } from '../config/api_list'
import { clearStates } from "../utils/clearStates"
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import HeadingComp from "../components/HeadingComp"
import { loginStorage } from '../storage/appStorage'

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    // 110 -> Branch Code
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
                    <Text variant='bodySmall'>{JSON.stringify(loginStore)}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})