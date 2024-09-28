import { StyleSheet, SafeAreaView, View, ScrollView, Alert, ToastAndroid } from 'react-native'
import { List, Divider } from "react-native-paper"
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
import LoadingOverlay from "../components/LoadingOverlay"
import EventSource from "react-native-sse";
import BMBasicDetailsForm from './forms/BMBasicDetailsForm'

const GRTFormScreen = () => {
    const theme = usePaperColorScheme()
    // 110 -> Branch Code
    // const navigation = useNavigation()

    // const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    return (
        <SafeAreaView>

            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="GRT Form" subtitle="Basic Details" />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10
                }}>
                    <BMBasicDetailsForm flag='CO' />
                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default GRTFormScreen

const styles = StyleSheet.create({})