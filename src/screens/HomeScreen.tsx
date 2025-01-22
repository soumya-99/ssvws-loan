import { StyleSheet, SafeAreaView, View, ScrollView, RefreshControl, ToastAndroid, Alert, Linking } from 'react-native'
import { Icon, IconButton, MD2Colors, Text } from "react-native-paper"
import React, { useCallback, useEffect, useState } from 'react'
import RNRestart from 'react-native-restart'
import { usePaperColorScheme } from '../theme/theme'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import HeadingComp from "../components/HeadingComp"
import ListCard from "../components/ListCard"
import { loginStorage } from '../storage/appStorage'
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
import DatePicker from 'react-native-date-picker'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { formattedDate, formattedDateTime } from '../utils/dateFormatter'
import LoadingOverlay from '../components/LoadingOverlay'
import RadioComp from '../components/RadioComp'
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import navigationRoutes from '../routes/routes'

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SlideButton from 'rn-slide-button'
import ButtonPaper from '../components/ButtonPaper'
import useGeoLocation from '../hooks/useGeoLocation'

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")

    const [refreshing, setRefreshing] = useState(() => false)
    const [loading, setLoading] = useState(() => false)

    const [currentTime, setCurrentTime] = useState(new Date());

    const [noOfGrtForms, setNoOfGrtForms] = useState(() => "")
    const [totalCashRecovery, setTotalCashRecovery] = useState(() => "")
    const [totalBankRecovery, setTotalBankRecovery] = useState(() => "")

    const [checkUser, setCheckUser] = useState(() => "O")

    const [openDate2, setOpenDate2] = useState(false)
    const [choosenDate, setChoosenDate] = useState(new Date())
    const formattedChoosenDate = formattedDate(choosenDate)

    const [isExtended, setIsExtended] = useState<boolean>(() => true)
    const [isClockedIn, setIsClockedIn] = useState<boolean>(() => false)
    const [clockedInDateTime, setClockedInDateTime] = useState(() => "")
    const [clockedInFetchedAddress, setClockedInFetchedAddress] = useState(() => "")
    const [clockInStatus, setClockInStatus] = useState<string>(() => "")

    // const onScroll = ({ nativeEvent }) => {
    //     const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0

    //     setIsExtended(currentScrollPosition <= 0)
    // }

    useEffect(() => {
        if (error) {
            Alert.alert("Turn on Geolocation", "Give access to Location or Turn on GPS from app settings.", [{
                text: "Go to Settings",
                onPress: () => { navigation.dispatch(CommonActions.goBack()); Linking.openSettings() }
            }])
        }
    }, [isFocused, error])

    // console.log("LOcAtion", location)
    // console.log("LOcAtion ERRR", error)

    const fetchGeoLocaltionAddress = async () => {
        console.log("REVERSE GEO ENCODING API CALLING...")
        await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyAhSuw5-ThQnJTZCGC4e_oBsL1iIUbJxts`).then(res => {
            setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        })
    }

    useEffect(() => {
        if (location?.latitude && location.longitude && !geolocationFetchedAddress) {
            fetchGeoLocaltionAddress()
        }
    }, [location])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

    const handleClockIn = async () => {
        console.log(`KLIKKK ${formattedDateTime(currentTime)}`)
        const creds = {
            emp_id: loginStore?.emp_id,
            in_date_time: formattedDateTime(currentTime),
            in_lat: location?.latitude,
            in_long: location?.longitude,
            in_addr: geolocationFetchedAddress,
            created_by: loginStore?.emp_id
        }
        await axios.post(`${ADDRESSES.CLOCK_IN}`, creds).then(res => {
            console.log("CLOCK IN RES", res?.data)
            setIsClockedIn(!isClockedIn)
        }).catch(err => {
            console.log("CLOCK IN ERR", err)
        })
    }

    const handleClockOut = async () => {
        // {
        //     "emp_id" : "",
        // "in_date_time":""
        //     "out_date_time" : "",
        //     "out_lat" : "",
        //     "out_long" : "",
        //     "out_addr" : "",
        //     "modified_by" : ""
        // }
        const creds = {
            emp_id: loginStore?.emp_id,
            in_date_time: formattedDateTime(new Date(clockedInDateTime)),
            out_date_time: formattedDateTime(currentTime),
            out_lat: location?.latitude,
            out_long: location?.longitude,
            out_addr: geolocationFetchedAddress,
            modified_by: loginStore?.emp_id
        }
        await axios.post(`${ADDRESSES.CLOCK_OUT}`, creds).then(res => {
            console.log("CLOCK OUT RES", res?.data)
            setIsClockedIn(!isClockedIn)
        }).catch(err => {
            console.log("CLOCK OUT ERR", err)
        })
    }

    const fetchClockedInDateTime = async () => {
        const creds = {
            emp_id: loginStore?.emp_id,
        }
        await axios.post(`${ADDRESSES.CLOCKED_IN_DATE_TIME}`, creds).then(res => {
            if (res?.data?.msg?.length === 0) {
                setIsClockedIn(false)
                return
            }
            console.log("CLOCK IN RES================", res?.data)
            setClockedInDateTime(res?.data?.msg[0]?.in_date_time)
            setClockedInFetchedAddress(res?.data?.msg[0]?.in_addr)
            setClockInStatus(res?.data?.msg[0]?.clock_status)
        }).catch(err => {
            console.log("CLOCK IN ERR", err)
        })
    }

    useEffect(() => {
        fetchClockedInDateTime()
    }, [isClockedIn])

    const fetchDashboardDetails = async () => {
        // setLoading(true)
        const creds = {
            emp_id: loginStore?.emp_id,
            datetime: formattedChoosenDate
        }
        await axios.post(`${ADDRESSES.DASHBOARD_DETAILS}`, creds).then(res => {
            console.log(">>>>>>>D<<<<<<<", res?.data)
            setNoOfGrtForms(res?.data?.msg[0]?.no_of_grt)
        }).catch(err => {
            console.log("ERRRRR<<<<<D", err)
        })
        // setLoading(false)
    }

    const fetchDashboardCashRecoveryDetails = async () => {
        // setLoading(true)
        const creds = {
            "branch_code": loginStore?.brn_code,
            "tr_mode": "C",
            "datetime": formattedChoosenDate,
            "created_by": loginStore?.emp_id
        }
        console.log("CREDSSS C", creds)
        await axios.post(`${ADDRESSES.DASHBOARD_CASH_RECOV_DETAILS}`, creds).then(res => {
            console.log(">>>>>>>C<<<<<<<", res?.data)
            setTotalCashRecovery(res?.data?.msg[0]?.tot_recov_cash)
        }).catch(err => {
            console.log("ERRRRR<<<<<C", err)
        })
        // setLoading(false)
    }

    const fetchDashboardBankRecoveryDetails = async () => {
        // setLoading(true)
        const creds = {
            "branch_code": loginStore?.brn_code,
            "tr_mode": "B",
            "datetime": formattedChoosenDate,
            "created_by": loginStore?.emp_id
        }
        console.log("CREDSSS B", creds)
        await axios.post(`${ADDRESSES.DASHBOARD_BANK_RECOV_DETAILS}`, creds).then(res => {
            console.log(">>>>>>>B<<<<<<<", res?.data)
            setTotalBankRecovery(res?.data?.msg[0]?.tot_recov_bank)
        }).catch(err => {
            console.log("ERRRRR<<<<<B", err)
        })
        // setLoading(false)
    }

    // useEffect(() => {
    //     fetchDashboardDetails()
    //     fetchDashboardCashRecoveryDetails()
    //     fetchDashboardBankRecoveryDetails()
    // }, [choosenDate])

    useEffect(() => {
        if (loginStore?.id === 1) { // CO
            fetchDashboardDetails()
            fetchDashboardCashRecoveryDetails()
            fetchDashboardBankRecoveryDetails()
        }
    }, [])

    const handleFetchDashboardDetailsGRTBM = async () => {
        const creds = {
            flag: checkUser,
            emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            datetime: formattedChoosenDate,
            branch_code: loginStore?.brn_code
        }
        await axios.post(`${ADDRESSES.DASHBOARD_DETAILS_BM}`, creds).then(res => {
            setNoOfGrtForms(res?.data?.msg[0]?.no_of_grt)
            console.log("----====----", res?.data)
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching dashboard details BM.", ToastAndroid.SHORT)
            console.log("Some Errr", err)
        })
    }

    const handleFetchDashboardCashDetailsBM = async () => {
        const creds = {
            flag: checkUser,
            emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            tr_mode: "C",
            datetime: formattedChoosenDate,
            branch_code: loginStore?.brn_code
        }
        await axios.post(`${ADDRESSES.DASHBOARD_CASH_DETAILS_BM}`, creds).then(res => {
            setTotalCashRecovery(res?.data?.msg[0]?.tot_recov_cash)
            console.log("----====----CC", res?.data)
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching dashboard details BM.", ToastAndroid.SHORT)
            console.log("Some Errr", err)
        })
    }

    const handleFetchDashboardBankDetailsBM = async () => {
        const creds = {
            flag: checkUser,
            emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            tr_mode: "B",
            datetime: formattedChoosenDate,
            branch_code: loginStore?.brn_code
        }
        await axios.post(`${ADDRESSES.DASHBOARD_BANK_DETAILS_BM}`, creds).then(res => {
            setTotalBankRecovery(res?.data?.msg[0]?.tot_recov_bank)
            console.log("----====----BB", res?.data)
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching dashboard details BM.", ToastAndroid.SHORT)
            console.log("Some Errr", err)
        })
    }

    useEffect(() => {
        if (loginStore?.id === 2) { // BM
            handleFetchDashboardDetailsGRTBM()
            handleFetchDashboardCashDetailsBM()
            handleFetchDashboardBankDetailsBM()
        }
    }, [checkUser])

    return (
        <SafeAreaView>
            {/* <ActivityIndicator size={'large'} /> */}
            {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{
                    backgroundColor: theme.colors.background,
                    // minHeight: SCREEN_HEIGHT,
                    // height: "auto",
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            // onScroll={onScroll}
            >
                <HeadingComp title={`Hi, ${(loginStore?.emp_name as string)?.split(" ")[0]}`} subtitle={`Welcome back, ${loginStore?.id === 1 ? "Credit Officer" : loginStore?.id === 2 ? "Branch Manager" : loginStore?.id === 3 ? "MIS Assistant" : "Administrator"}!`} background={MD2Colors.blue100} footerText={`Branch • ${loginStore?.branch_name}`} />
                <View style={{
                    // paddingHorizontal: 20,
                    // paddingBottom: 120,
                    // gap: 8
                    width: SCREEN_WIDTH,
                    // justifyContent: "center",
                    alignItems: "center",
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                }}>

                    {console.log("+++++++++++++++++", clockInStatus, isClockedIn)}
                    {clockInStatus === "O" || !clockInStatus ? <View style={{
                        backgroundColor: MD2Colors.green50,
                        width: SCREEN_WIDTH / 1.1,
                        height: "auto",
                        marginBottom: 10,
                        borderTopRightRadius: 30,
                        borderBottomLeftRadius: 30,
                        padding: 15,
                        gap: 10,
                        // flexDirection: "row",
                        // justifyContent: "space-between",
                    }}>
                        <ButtonPaper
                            icon={"clock-outline"}
                            onPress={
                                () => {
                                    !geolocationFetchedAddress && fetchGeoLocaltionAddress()
                                    Alert.alert("Clock In", `Are you sure you want to Clock In?\nTime: ${currentTime.toLocaleTimeString("en-GB")}\nLocation: ${geolocationFetchedAddress || "Fetching..."}`, [
                                        { "text": "Cancel", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" },
                                        { "text": "CLOCK IN", "onPress": async () => await handleClockIn() }
                                    ])
                                }
                            }
                            mode='elevated'
                            buttonColor={MD2Colors.green600}
                            textColor={MD2Colors.green50}
                            style={{
                                borderRadius: 0,
                                borderTopRightRadius: 15,
                                borderBottomLeftRadius: 15,
                            }}
                            disabled={!geolocationFetchedAddress}>{!geolocationFetchedAddress ? "Fetching Address..." : "Clock In"}</ButtonPaper>
                        {/* <IconButton icon={"table-large"} onPress={() => null} iconColor={MD2Colors.green900} /> */}
                    </View>
                        : <View style={{
                            backgroundColor: MD2Colors.pink50,
                            width: SCREEN_WIDTH / 1.1,
                            height: "auto",
                            marginBottom: 10,
                            borderTopRightRadius: 30,
                            borderBottomLeftRadius: 30,
                            padding: 15,
                            gap: 10,
                        }}>
                            <ButtonPaper
                                icon={"clock-out"}
                                onPress={
                                    () => Alert.alert("Clock Out", `Are you sure you want to Clock Out?\nTime: ${currentTime.toLocaleTimeString("en-GB")}\nLocation: ${geolocationFetchedAddress}`, [
                                        { "text": "Cancel", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" },
                                        { "text": "CLOCK OUT", "onPress": async () => await handleClockOut() }
                                    ])
                                }
                                mode='elevated'
                                buttonColor={MD2Colors.pink600}
                                textColor={MD2Colors.pink50}
                                style={{
                                    borderRadius: 0,
                                    borderTopRightRadius: 15,
                                    borderBottomLeftRadius: 15,
                                }}
                                disabled={!geolocationFetchedAddress}>Clock Out</ButtonPaper>
                            <View style={{
                                // dashed border outside inside text
                                borderWidth: 1,
                                borderColor: MD2Colors.pink900,
                                borderStyle: "dashed",
                                borderRadius: 15,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                padding: 10,
                                marginTop: 5,
                                justifyContent: "center",
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 10
                                }}>
                                    <Icon source={"clock-in"} size={20} color={MD2Colors.pink900} />
                                    <Text variant='bodyLarge' style={{
                                        color: MD2Colors.pink900
                                    }}>{new Date(clockedInDateTime).toLocaleTimeString("en-GB")}</Text>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 10,
                                }}>
                                    <Icon source={"map-marker-outline"} size={20} color={MD2Colors.pink900} />
                                    <Text variant='bodyLarge' style={{
                                        color: MD2Colors.pink900,
                                    }}>
                                        {clockedInFetchedAddress?.length > 10 ? `${clockedInFetchedAddress?.substring(0, 30)}...` : clockedInFetchedAddress}
                                    </Text>
                                </View>

                            </View>
                        </View>}


                    {/* <Text variant='bodyLarge'>{JSON.stringify(loginStore)}</Text> */}

                    {/* Dashboard Starts From Here... */}

                    <View style={{
                        backgroundColor: MD2Colors.blue50,
                        width: SCREEN_WIDTH / 1.1,
                        height: "auto",
                        marginBottom: 10,
                        borderTopRightRadius: 30,
                        borderBottomLeftRadius: 30,
                        padding: 15,
                        gap: 10,
                    }}>
                        {loginStore?.id === 2 && <View>
                            <RadioComp
                                title={checkUser === "Own" ? `Your Data` : `All User`}
                                titleColor={MD2Colors.blue900}
                                color={MD2Colors.blue900}
                                radioButtonColor={MD2Colors.blue900}
                                icon="account-convert-outline"
                                dataArray={[
                                    {
                                        optionName: "OWN",
                                        optionState: checkUser,
                                        currentState: "O", // bm emp_id -> 
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                    {
                                        optionName: "ALL",
                                        optionState: checkUser,
                                        currentState: "A", // emp_id -> 0
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                ]}
                            />
                        </View>}
                        {/* <Text variant='bodyLarge' style={{
                            color: MD2Colors.blue900
                        }}>Branch - {loginStore?.branch_name}</Text> */}

                        <View style={{
                            height: 80,
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            borderRadius: 20,
                            borderBottomRightRadius: 0,
                            borderBottomLeftRadius: 0,
                            alignItems: "center",
                            paddingHorizontal: 15,
                            flexDirection: "row-reverse",
                            justifyContent: "space-between",
                            // gap: 15
                        }}>
                            <View style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                width: 53,
                                height: 53,
                                borderRadius: 150,
                                justifyContent: 'center',
                                alignItems: "center"
                            }}>
                                <IconButton icon="calendar-month-outline" iconColor={theme.colors.onTertiaryContainer} onPress={() => setOpenDate2(true)} />
                                {/* <DatePicker
                                    modal
                                    mode="date"
                                    open={openDate2}
                                    date={choosenDate}
                                    onConfirm={date => {
                                        setChoosenDate(date)
                                        setOpenDate2(false)
                                    }}
                                    onCancel={() => {
                                        setOpenDate2(false)
                                    }}
                                /> */}
                            </View>
                            <View>
                                <Icon source="arrow-left-thin" size={25} color={theme.colors.onSurface} />
                            </View>
                            <View>
                                <Text variant='titleMedium' style={{ color: theme.colors.tertiary }}>{`DATE: ${choosenDate.toLocaleDateString("en-GB")}`}</Text>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`CURRENT TIME: ${currentTime.toLocaleTimeString("en-GB")}`}</Text>
                            </View>
                        </View>

                        <ListCard
                            title={`No. of GRTs`}
                            subtitle={`${noOfGrtForms || 0} Forms`}
                            position={0}
                            icon='format-list-numbered'
                            iconViewColor={MD2Colors.green500}
                            iconViewBorderColor={MD2Colors.green200}
                        />
                        <ListCard
                            title={`Total Cash Recovery`}
                            subtitle={`Rs. ${totalCashRecovery || 0}/-`}
                            position={0}
                            icon='cash'
                            iconViewColor={MD2Colors.pink500}
                            iconViewBorderColor={MD2Colors.pink200}
                        />
                        <ListCard
                            title={`Total Bank Recovery`}
                            subtitle={`Rs. ${totalBankRecovery || 0}/-`}
                            position={-1}
                            icon='bank'
                            iconViewColor={MD2Colors.blue500}
                            iconViewBorderColor={MD2Colors.blue200}
                        />

                    </View>


                </View>
            </ScrollView>

            {/* <GestureHandlerRootView> */}
            {/* <SlideButton title="Slide To Unlock" /> */}


            {loginStore?.id === 2 && <AnimatedFABPaper
                color={theme.colors.onTertiaryContainer}
                variant="tertiary"
                icon="form-select"
                label="Pending Forms"
                onPress={() =>
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: navigationRoutes.bmPendingLoansScreen,
                        }),
                    )
                }
                extended={isExtended}
                animateFrom="left"
                iconMode="dynamic"
                customStyle={[styles.fabStyle, { backgroundColor: theme.colors.tertiaryContainer }]}
            />}

            {loginStore?.id === 1 && <AnimatedFABPaper
                color={theme.colors.onTertiaryContainer}
                variant="tertiary"
                icon="form-select"
                label="GRT Form"
                onPress={() =>
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: navigationRoutes.grtFormScreen,
                        }),
                    )
                }
                extended={isExtended}
                animateFrom="left"
                iconMode="dynamic"
                customStyle={[styles.fabStyle, { backgroundColor: theme.colors.tertiaryContainer }]}
            />}
            {/* </GestureHandlerRootView> */}

            {/* </GestureHandlerRootView> */}
        </SafeAreaView >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    fabStyle: {
        bottom: normalize(16),
        right: normalize(16),
        position: "absolute",
    },
})