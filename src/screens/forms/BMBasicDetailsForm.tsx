import { StyleSheet, SafeAreaView, View, ScrollView, Alert, ToastAndroid } from 'react-native'
import { List, Divider } from "react-native-paper"
import React, { Suspense, useEffect, useState } from 'react'
import { formattedDate } from "../../utils/dateFormatter"
import InputPaper from "../../components/InputPaper"
import ButtonPaper from "../../components/ButtonPaper"
import { usePaperColorScheme } from '../../theme/theme'
import DatePicker from "react-native-date-picker"
import MenuPaper from "../../components/MenuPaper"
import axios from "axios"
import { ADDRESSES } from '../../config/api_list'
import { clearStates } from "../../utils/clearStates"
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
import HeadingComp from "../../components/HeadingComp"
import { loginStorage } from '../../storage/appStorage'
import LoadingOverlay from "../../components/LoadingOverlay"
import EventSource from "react-native-sse";

const BMBasicDetailsForm = ({ formNumber, branchCode }) => {
    const theme = usePaperColorScheme()
    // 110 -> Branch Code
    const navigation = useNavigation()
    console.log("****************", formNumber, branchCode)

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    const [religions, setReligions] = useState(() => []) // rel
    const [castes, setCastes] = useState(() => [])
    const [educations, setEducations] = useState(() => []) // edu
    const [groupNames, setGroupNames] = useState(() => [])

    const [formData, setFormData] = useState({
        clientName: "",
        clientMobile: "",
        guardianName: "",
        guardianMobile: "",
        clientAddress: "",
        clientPin: "",
        aadhaarNumber: "",
        panNumber: "",
        religion: "",
        caste: "",
        education: "",
        groupCode: "",
        groupCodeName: "",
        dob: new Date()
    })

    // const [dob, setDob] = useState(() => new Date()) //dob
    const [openDate, setOpenDate] = useState(() => false)
    const formattedDob = formattedDate(formData?.dob)


    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleFetchGroupNames = async () => {
        setLoading(true)
        setGroupNames(() => [])
        await axios.get(`${ADDRESSES.GROUP_NAMES}?branch_code=${loginStore?.brn_code}`).then(res => {
            // setGroupNamesAndCodesTemp(res?.data?.msg)
            console.log("XXXXXXXXXXXXXXXXXX", res?.data?.msg)

            res?.data?.msg?.map((item, i) => {
                return (
                    //@ts-ignore
                    setGroupNames(prev => [...prev, { title: item?.group_name, func: () => { handleFormChange("groupCode", item?.group_code); handleFormChange("groupCodeName", item?.group_name) } }])
                )
            })

        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchGroupNames}!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const handleFetchReligions = async () => {
        setLoading(true)
        setReligions(() => [])
        await axios.get(`${ADDRESSES.GET_RELIGIONS}`).then(res => {
            res?.data?.map((item, i) => (
                //@ts-ignore
                setReligions(prev => [...prev, { title: item?.name, func: () => handleFormChange("religion", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const handleFetchCastes = async () => {
        setLoading(true)
        setCastes(() => [])
        await axios.get(`${ADDRESSES.GET_CASTES}`).then(res => {
            res?.data?.map((item, i) => (
                //@ts-ignore
                setCastes(prev => [...prev, { title: item?.name, func: () => handleFormChange("caste", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchCastes}!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const handleFetchEducations = async () => {
        setLoading(true)
        setEducations(() => [])
        await axios.get(`${ADDRESSES.GET_EDUCATIONS}`).then(res => {
            res?.data?.map((item, i) => (
                //@ts-ignore
                setEducations(prev => [...prev, { title: item?.name, func: () => handleFormChange("education", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchEducations}!", ToastAndroid.SHORT)
        })
        setLoading(false)
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

        if (!formData.clientMobile || !formData.aadhaarNumber || !formData.panNumber) {
            ToastAndroid.show("Fill Mobile, PAN and Aadhaar.", ToastAndroid.SHORT)
            return
        }

        await axios.post(`${ADDRESSES.FETCH_CLIENT_DETAILS}`, creds).then(res => {
            if (res?.data?.msg?.length > 0) {
                setFormData({
                    clientName: res?.data?.msg[0]?.client_name,
                    clientMobile: res?.data?.msg[0]?.client_mobile,
                    guardianName: res?.data?.msg[0]?.gurd_name,
                    guardianMobile: res?.data?.msg[0]?.gurd_mobile,
                    clientAddress: res?.data?.msg[0]?.client_addr,
                    clientPin: res?.data?.msg[0]?.pin_no,
                    aadhaarNumber: res?.data?.msg[0]?.aadhar_no,
                    panNumber: res?.data?.msg[0]?.pan_no,
                    religion: res?.data?.msg[0]?.religion,
                    caste: res?.data?.msg[0]?.caste,
                    education: res?.data?.msg[0]?.education,
                    groupCode: res?.data?.msg[0]?.prov_grp_code,
                    groupCodeName: res?.data?.msg[0]?.prov_grp_name,
                    dob: new Date(res?.data?.msg[0]?.dob)
                })
            } else {
                ToastAndroid.show("New client.", ToastAndroid.SHORT)
            }
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching data", ToastAndroid.SHORT)
        })
    }

    const fetchBasicDetails = async () => {
        setLoading(true)

        const creds = {
            branch_code: branchCode,
            form_no: formNumber
        }

        await axios.post(`${ADDRESSES.FETCH_BASIC_DETAILS}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                console.log("LLLLLLLLLLLLLLLLL", res?.data?.msg[0]?.prov_grp_code)

                setFormData({
                    clientName: res?.data?.msg[0]?.client_name,
                    clientMobile: res?.data?.msg[0]?.client_mobile,
                    guardianName: res?.data?.msg[0]?.gurd_name,
                    guardianMobile: res?.data?.msg[0]?.gurd_mobile,
                    clientAddress: res?.data?.msg[0]?.client_addr,
                    clientPin: res?.data?.msg[0]?.pin_no,
                    aadhaarNumber: res?.data?.msg[0]?.aadhar_no,
                    panNumber: res?.data?.msg[0]?.pan_no,
                    religion: res?.data?.msg[0]?.religion,
                    caste: res?.data?.msg[0]?.caste,
                    education: res?.data?.msg[0]?.education,
                    groupCode: res?.data?.msg[0]?.prov_grp_code,
                    groupCodeName: res?.data?.msg[0]?.prov_grp_name,
                    dob: new Date(res?.data?.msg[0]?.dob)
                })

            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching basic details!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    useEffect(() => {
        fetchBasicDetails()
    }, [])

    // const handleResetForm = () => {
    //     Alert.alert("Reset", "Are you sure about this?", [{
    //         text: "No",
    //         onPress: () => null
    //     }, {
    //         text: "Yes",
    //         onPress: () => {
    //             clearStates([
    //                 setClientName,
    //                 setClientMobile,
    //                 setGuardianName,
    //                 setGuardianMobile,
    //                 setClientAddress,
    //                 setClientPin,
    //                 setAadhaarNumber,
    //                 setPanNumber,
    //                 setReligion,
    //                 setCaste,
    //                 setEducation
    //             ], "")
    //             setDob(new Date())
    //         }
    //     }])

    // }

    // const handleSubmitBasicDetails = async () => {
    //     setLoading(true)
    //     const creds = {
    //         branch_code: loginStore?.brn_code,
    //         prov_grp_code: groupCode,
    //         client_name: clientName,
    //         client_mobile: clientMobile,
    //         gurd_name: guardianName,
    //         gurd_mobile: guardianMobile,
    //         client_addr: clientAddress,
    //         pin_no: clientPin,
    //         aadhar_no: aadhaarNumber,
    //         pan_no: panNumber,
    //         religion: religion,
    //         caste: caste,
    //         education: education,
    //         dob: formattedDob,
    //         created_by: loginStore?.emp_name
    //     }

    //     if (!clientMobile || !aadhaarNumber || !panNumber) {
    //         ToastAndroid.show("Fill Mobile, PAN and Aadhaar.", ToastAndroid.SHORT)
    //         return
    //     }

    //     await axios.post(`${ADDRESSES.SAVE_BASIC_DETAILS}`, creds).then(res => {
    //         console.log("-----------", res?.data)
    //         Alert.alert("Success", "Basic Details Saved!")
    //         clearStates([
    //             setClientName,
    //             setClientMobile,
    //             setGuardianName,
    //             setGuardianMobile,
    //             setClientAddress,
    //             setClientPin,
    //             setAadhaarNumber,
    //             setPanNumber,
    //             setReligion,
    //             setCaste,
    //             setEducation
    //         ], "")
    //         setDob(new Date())
    //     }).catch(err => {
    //         ToastAndroid.show("Some error occurred while submitting basic details", ToastAndroid.SHORT)
    //     })
    //     setLoading(false)
    // }

    const handleUpdateBasicDetails = async () => {
        const creds = {
            form_no: formNumber,
            prov_grp_code: formData.groupCode,
            client_name: formData.clientName,
            client_mobile: formData.clientMobile,
            gurd_name: formData.guardianName,
            gurd_mobile: formData.guardianMobile,
            client_addr: formData.clientAddress,
            pin_no: formData.clientPin,
            aadhar_no: formData.aadhaarNumber,
            pan_no: formData.panNumber,
            religion: formData.religion,
            caste: formData.caste,
            education: formData.education,
            dob: formattedDob,
            modified_by: loginStore?.emp_name
        }
        await axios.post(`${ADDRESSES.EDIT_BASIC_DETAILS}`, creds).then(res => {
            console.log("QQQQQQQQQQQQQQQ", res?.data)
            ToastAndroid.show("Update Successful", ToastAndroid.SHORT)
        }).catch(err => {
            ToastAndroid.show("Some error while updating basic details!", ToastAndroid.SHORT)
        })
    }

    const renderLoader = () => loading && <LoadingOverlay />;

    return (
        <SafeAreaView>

            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <View style={{
                    // paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10
                }}>
                    <Divider />

                    <List.Item
                        title="Choose Group"
                        description={`Group Code: ${formData.groupCodeName}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupNames} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <Divider />

                    <InputPaper label="Mobile No." maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={formData.clientMobile} onChangeText={(txt: any) => handleFormChange("clientMobile", txt)} onBlur={() => fetchClientDetails("M", formData.clientMobile)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Aadhaar No." maxLength={12} leftIcon='card-account-details-star-outline' keyboardType="numeric" value={formData.aadhaarNumber} onChangeText={(txt: any) => handleFormChange("aadhaarNumber", txt)} onBlur={() => fetchClientDetails("A", formData.aadhaarNumber)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="PAN No." maxLength={10} leftIcon='card-account-details-outline' keyboardType="default" value={formData.panNumber} onChangeText={(txt: any) => handleFormChange("panNumber", txt)} onBlur={() => fetchClientDetails("P", formData.panNumber)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Client Name" leftIcon='account-circle-outline' value={formData.clientName} onChangeText={(txt: any) => handleFormChange("clientName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Guardian Name" leftIcon='account-cowboy-hat-outline' value={formData.guardianName} onChangeText={(txt: any) => handleFormChange("guardianName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Guardian Mobile No." maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={formData.guardianMobile} onChangeText={(txt: any) => handleFormChange("guardianMobile", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Client Address" multiline leftIcon='card-account-phone-outline' value={formData.clientAddress} onChangeText={(txt: any) => handleFormChange("clientAddress", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} />

                    <InputPaper label="Client PIN No." leftIcon='map-marker-radius-outline' keyboardType="numeric" value={formData.clientPin} onChangeText={(txt: any) => handleFormChange("clientPin", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenDate(true)}
                        mode="text"
                        icon="baby-face-outline">
                        CHOOSE DOB: {formData.dob?.toLocaleDateString("en-GB")}
                    </ButtonPaper>
                    <DatePicker
                        modal
                        mode="date"
                        // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
                        open={openDate}
                        date={formData.dob}
                        onConfirm={date => {
                            setOpenDate(false)
                            handleFormChange("dob", date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    />

                    <List.Item
                        title="Choose Religion"
                        description={`Religion: ${formData.religion}`}
                        left={props => <List.Icon {...props} icon="peace" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={religions} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <List.Item
                        title="Choose Caste"
                        description={`Caste: ${formData.caste}`}
                        left={props => <List.Icon {...props} icon="account-question-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={castes} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <List.Item
                        title="Choose Education"
                        description={`Education: ${formData.education}`}
                        left={props => <List.Icon {...props} icon="book-education-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={educations} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    {/* <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 40,
                        marginBottom: 10
                    }}>
                        <ButtonPaper mode="text" textColor={theme.colors.error} onPress={handleResetForm} icon="backup-restore">
                            RESET FORM
                        </ButtonPaper>
                        <ButtonPaper
                            mode="contained"
                            icon="content-save-outline"
                            onPress={() => {
                                Alert.alert("Create GRT", "Are you sure you want to create this GRT?", [
                                    { text: "No", onPress: () => null },
                                    { text: "Yes", onPress: () => handleSubmitBasicDetails() },
                                ])
                            }}
                            disabled={loading || !clientMobile || !aadhaarNumber || !panNumber || !clientName || !guardianName || !guardianMobile || !clientAddress || !clientPin || !dob || !religion || !caste || !education}
                            loading={loading}
                            buttonColor={theme.colors.primary}>
                            SUBMIT
                        </ButtonPaper>
                    </View> */}

                    <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={() => {
                        Alert.alert("Update Basic Details", "Are you sure you want to update this?", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleUpdateBasicDetails() },
                        ])
                    }} disabled={loading || !formData.clientMobile || !formData.aadhaarNumber || !formData.panNumber || !formData.clientName || !formData.guardianName || !formData.guardianMobile || !formData.clientAddress || !formData.clientPin || !formData.dob || !formData.religion || !formData.caste || !formData.education}
                        loading={loading}>UPDATE</ButtonPaper>
                </View>
            </ScrollView>
            {/* {loading && (
                <LoadingOverlay />
            )} */}
        </SafeAreaView>
    )
}

export default BMBasicDetailsForm

const styles = StyleSheet.create({})