import { StyleSheet, SafeAreaView, View, ScrollView, RefreshControl } from 'react-native'
import { Icon, IconButton, MD2Colors, Text } from "react-native-paper"
import React, { useCallback, useEffect, useState } from 'react'
import RNRestart from 'react-native-restart'
import { usePaperColorScheme } from '../theme/theme'
import { CommonActions, useNavigation } from '@react-navigation/native'
import HeadingComp from "../components/HeadingComp"
import ListCard from "../components/ListCard"
import { loginStorage } from '../storage/appStorage'
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
import DatePicker from 'react-native-date-picker'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { formattedDate } from '../utils/dateFormatter'
import LoadingOverlay from '../components/LoadingOverlay'
import RadioComp from '../components/RadioComp'
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import navigationRoutes from '../routes/routes'

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [refreshing, setRefreshing] = useState(() => false)
    const [loading, setLoading] = useState(() => false)

    const [currentTime, setCurrentTime] = useState(new Date());

    const [noOfGrtForms, setNoOfGrtForms] = useState(() => "")
    const [totalCashRecovery, setTotalCashRecovery] = useState(() => "")
    const [totalBankRecovery, setTotalBankRecovery] = useState(() => "")

    const [checkUser, setCheckUser] = useState(() => "Own")

    const [openDate2, setOpenDate2] = useState(false)
    const [choosenDate, setChoosenDate] = useState(new Date())
    const formattedChoosenDate = formattedDate(choosenDate)

    const [isExtended, setIsExtended] = useState<boolean>(() => true)

    // const onScroll = ({ nativeEvent }) => {
    //     const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0

    //     setIsExtended(currentScrollPosition <= 0)
    // }

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
        fetchDashboardDetails()
        fetchDashboardCashRecoveryDetails()
        fetchDashboardBankRecoveryDetails()
    }, [])

    return (
        <SafeAreaView>
            {/* <ActivityIndicator size={'large'} /> */}
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
                <HeadingComp title={`Hi, ${(loginStore?.emp_name as string)?.split(" ")[0]}`} subtitle={`Welcome back ${loginStore?.id === 1 ? "Credit Officer" : "Branch Manager"}!`} background={MD2Colors.blue100} footerText={`Branch • ${loginStore?.branch_name}`} />
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
                                        currentState: "Own",
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                    {
                                        optionName: "ALL",
                                        optionState: checkUser,
                                        currentState: "All",
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


        </SafeAreaView>
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