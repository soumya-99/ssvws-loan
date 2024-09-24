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
import AppBarComp from "../components/AppBarComp"
import { loginStorage } from '../storage/appStorage'

const GRTFormScreen = () => {
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
                //@ts-ignore
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
                //@ts-ignore
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
                //@ts-ignore
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
                //@ts-ignore
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

        // if (!clientMobile || !aadhaarNumber || !panNumber) {
        //     // ToastAndroid.show("Fill Mobile, PAN and Aadhaar.", ToastAndroid.SHORT)
        //     return
        // }

        await axios.post(`${ADDRESSES.FETCH_CLIENT_DETAILS}`, creds).then(res => {
            if (res?.data?.msg?.length > 0) {
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
            } else {
                ToastAndroid.show("New client.", ToastAndroid.SHORT)
            }
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching data", ToastAndroid.SHORT)
        })
    }

    const handleCreateNewGroup = () => {
        // console.log("New group created!")
        navigation.dispatch(CommonActions.navigate({
            name: navigationRoutes.groupNavigation,
        }))
    }

    const handleResetForm = () => {
        Alert.alert("Reset", "Are you sure about this?", [{
            text: "Yes",
            onPress: () => clearStates([
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
        }, {
            text: "No",
            onPress: () => null
        }])

    }

    const handleSubmitBasicDetails = async () => {
        const creds = {
            branch_code: loginStore?.brn_code,
            prov_grp_code: groupCode,
            client_name: clientName,
            client_mobile: clientMobile,
            gurd_name: guardianName,
            gurd_mobile: guardianMobile,
            client_addr: clientAddress,
            pin_no: clientPin,
            aadhar_no: aadhaarNumber,
            pan_no: panNumber,
            religion: religion,
            caste: caste,
            education: education,
            dob: formattedDob,
            created_by: loginStore?.emp_name
        }

        if (!clientMobile || !aadhaarNumber || !panNumber) {
            ToastAndroid.show("Fill Mobile, PAN and Aadhaar.", ToastAndroid.SHORT)
            return
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
            setDob(new Date())
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting basic details", ToastAndroid.SHORT)
        })
    }

    return (
        <SafeAreaView>
            {/* <AppBarComp /> */}
            {/* <ActivityIndicator size={'large'} /> */}
            <ScrollView style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="GRT Form" subtitle="Basic Details" />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 8
                }}>
                    <Divider />
                    <InputPaper label="Mobile No." maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={clientMobile} onChangeText={(txt: any) => setClientMobile(txt)} onBlur={() => fetchClientDetails("M", clientMobile)} />

                    <InputPaper label="Aadhaar No." maxLength={12} leftIcon='card-account-details-star-outline' keyboardType="numeric" value={aadhaarNumber} onChangeText={(txt: any) => setAadhaarNumber(txt)} onBlur={() => fetchClientDetails("A", aadhaarNumber)} />

                    <InputPaper label="PAN No." maxLength={10} leftIcon='card-account-details-outline' keyboardType="default" value={panNumber} onChangeText={(txt: any) => setPanNumber(txt)} onBlur={() => fetchClientDetails("P", panNumber)} />

                    <InputPaper label="Client Name" leftIcon='account-circle-outline' value={clientName} onChangeText={(txt: any) => setClientName(txt)} />

                    <InputPaper label="Guarian Name" leftIcon='account-cowboy-hat-outline' value={guardianName} onChangeText={(txt: any) => setGuardianName(txt)} />

                    <InputPaper label="Guardian Mobile No." maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={guardianMobile} onChangeText={(txt: any) => setGuardianMobile(txt)} />

                    <InputPaper label="Client Address" leftIcon='card-account-phone-outline' value={clientAddress} onChangeText={(txt: any) => setClientAddress(txt)} />

                    <InputPaper label="Client PIN No." leftIcon='map-marker-radius-outline' keyboardType="numeric" value={clientPin} onChangeText={(txt: any) => setClientPin(txt)} />

                    <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenDate(true)}
                        mode="text"
                        icon="baby-face-outline">
                        CHOOSE DOB: {dob?.toLocaleDateString("en-GB")}
                    </ButtonPaper>
                    <DatePicker
                        modal
                        mode="date"
                        // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
                        open={openDate}
                        date={dob}
                        onConfirm={date => {
                            setOpenDate(false)
                            setDob(date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    />

                    <List.Item
                        title="Choose Religion"
                        description={`Religion: ${religion}`}
                        left={props => <List.Icon {...props} icon="peace" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={religions} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    {/* <InputPaper label="Religion" value={religion} onChangeText={(txt: any) => setReligion(txt)} /> */}

                    <List.Item
                        title="Choose Caste"
                        description={`Caste: ${caste}`}
                        left={props => <List.Icon {...props} icon="account-question-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={castes} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    {/* <InputPaper label="Caste" value={caste} onChangeText={(txt: any) => setCaste(txt)} /> */}

                    <List.Item
                        title="Choose Education"
                        description={`Education: ${education}`}
                        left={props => <List.Icon {...props} icon="book-education-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={educations} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    {/* <InputPaper label="Education" value={education} onChangeText={(txt: any) => setEducation(txt)} /> */}

                    <List.Item
                        title="Choose Group"
                        description={`Group Code: ${groupCode}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupNames} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    <ButtonPaper mode='text' onPress={handleCreateNewGroup} icon="account-multiple-plus-outline">
                        Create New Group
                    </ButtonPaper>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 40,
                        marginBottom: 10
                    }}>
                        <ButtonPaper mode="text" textColor={theme.colors.error} onPress={handleResetForm} icon="backup-restore">
                            RESET FORM
                        </ButtonPaper>
                        <ButtonPaper mode="contained" icon="content-save-outline" onPress={() => {
                            Alert.alert("Create GRT", "Are you sure you want to create this GRT?", [
                                { text: "No", onPress: () => null },
                                { text: "Yes", onPress: () => handleSubmitBasicDetails() },
                            ])
                        }} style={{

                        }}>
                            SUBMIT
                        </ButtonPaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GRTFormScreen

const styles = StyleSheet.create({})