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

    // created_by
    const [dob, setDob] = useState(() => new Date()) //dob
    const [openDate, setOpenDate] = useState(() => false)
    const formattedDob = formattedDate(dob)

    const [clientName, setClientName] = useState(() => "") // name
    const [clientMobile, setClientMobile] = useState(() => "") // mob
    const [guardianName, setGuardianName] = useState(() => "") // guard
    const [guardianMobile, setGuardianMobile] = useState(() => "") // guradmob
    const [clientAddress, setClientAddress] = useState(() => "") // addr
    const [clientPin, setClientPin] = useState(() => "") // pin
    const [aadhaarNumber, setAadhaarNumber] = useState(() => "") // aadhaar
    const [panNumber, setPanNumber] = useState(() => "") //pan
    const [religions, setReligions] = useState(() => []) // rel
    const [religion, setReligion] = useState(() => "") // rel
    const [castes, setCastes] = useState(() => [])
    const [caste, setCaste] = useState(() => "") // cas
    const [educations, setEducations] = useState(() => []) // edu
    const [education, setEducation] = useState(() => "") // edu
    const [groupNames, setGroupNames] = useState(() => [])
    const [groupCode, setGroupCode] = useState(() => "") // grp_code

    // const [fullUserDetails, setFullUserDetails] = useState(() => "")

    const handleFetchGroupNames = async () => {
        setGroupNames(() => [])
        await axios.get(`${ADDRESSES.GROUP_NAMES}?branch_code=${loginStore?.brn_code}`).then(res => {

            console.log("================", res?.data?.msg)

            res?.data?.msg?.map((item, i) => (
                setGroupNames(prev => [...prev, { title: item?.group_name, func: () => setGroupCode(item?.group_code) }])
            ))

        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchGroupNames}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchReligions = async () => {
        setReligions(() => [])
        await axios.get(`${ADDRESSES.GET_RELIGIONS}`).then(res => {
            res?.data?.map((item, i) => (
                setReligions(prev => [...prev, { title: item?.name, func: () => setReligion(item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchCastes = async () => {
        setCastes(() => [])
        await axios.get(`${ADDRESSES.GET_CASTES}`).then(res => {
            res?.data?.map((item, i) => (
                setCastes(prev => [...prev, { title: item?.name, func: () => setCaste(item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchEducations = async () => {
        setEducations(() => [])
        await axios.get(`${ADDRESSES.GET_EDUCATIONS}`).then(res => {
            res?.data?.map((item, i) => (
                setEducations(prev => [...prev, { title: item?.name, func: () => setEducation(item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        handleFetchGroupNames()
        handleFetchReligions()
        handleFetchCastes()
        handleFetchEducations()
    }, [])

    const fetchClientDetails = async (flag, data) => {
        const creds = {
            flag: flag,
            user_dt: data
        }

        await axios.post(`${ADDRESSES.FETCH_CLIENT_DETAILS}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                // setFullUserDetails(JSON.stringify(res?.data?.msg[0]))
                setClientName(res?.data?.msg[0]?.client_name)
                setClientMobile(res?.data?.msg[0]?.client_mobile)
                setGuardianName(res?.data?.msg[0]?.gurd_name)
                setGuardianMobile(res?.data?.msg[0]?.gurd_mobile)
                setClientAddress(res?.data?.msg[0]?.client_addr)
                setClientPin(res?.data?.msg[0]?.pin_no)
                setAadhaarNumber(res?.data?.msg[0]?.aadhar_no)
                setPanNumber(res?.data?.msg[0]?.pan_no)
                setReligion(res?.data?.msg[0]?.religion)
                setCaste(res?.data?.msg[0]?.caste)
                setEducation(res?.data?.msg[0]?.education)
                setGroupCode(res?.data?.msg[0]?.prov_grp_code)
                setDob(new Date(res?.data?.msg[0]?.dob))
            }
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching data", ToastAndroid.SHORT)
        })
    }

    const handleCreateNewGroup = () => {
        // console.log("New group created!")
        navigation.dispatch(CommonActions.navigate({
            name: navigationRoutes.groupFormScreen,
        }))
    }

    const handleSubmitBasicDetails = async () => {
        const creds = {
            branch_code: 110, // should be dynamic in future (from loginStorage)
            prov_grp_code: groupCode,
            client_name: clientName,
            client_mobile: clientMobile,
            gurd_name: guardianName,
            gurd_mobile: guardianMobile,
            client_addr: clientAddress,
            pin_no: clientPin,
            aadhar_no: aadhaarNumber,
            pan_no: panNumber,
            religion: religion, // dropdown
            caste: caste, // dropdown
            education: education, // dropdown
            dob: formattedDob,
            created_by: "Soumyadeep Mondal" // should be dynamic in future (from loginStorage)
        }

        await axios.post(`${ADDRESSES.SAVE_BASIC_DETAILS}`, creds).then(res => {
            console.log("-----------", res?.data)
            Alert.alert("Success", "Basic Details Saved!")
            clearStates([
                setClientName,
                setClientMobile,
                setGuardianName,
                setGuardianMobile,
                setClientAddress,
                setClientPin,
                setAadhaarNumber,
                setPanNumber,
                setReligion,
                setCaste,
                setEducation
            ], "")
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting basic details", ToastAndroid.SHORT)
        })
    }

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