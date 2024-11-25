import { StyleSheet, SafeAreaView, View, ScrollView, RefreshControl } from 'react-native'
import { Icon, IconButton, MD2Colors, Text } from "react-native-paper"
import React, { useCallback, useEffect, useState } from 'react'
import RNRestart from 'react-native-restart'
import { usePaperColorScheme } from '../theme/theme'
import { useNavigation } from '@react-navigation/native'
import HeadingComp from "../components/HeadingComp"
import { loginStorage } from '../storage/appStorage'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
import DatePicker from 'react-native-date-picker'

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [refreshing, setRefreshing] = useState(() => false)

    const [openDate, setOpenDate] = useState(() => false)
    const [choosenDate, setChoosenDate] = useState(() => new Date())

    const [currentTime, setCurrentTime] = useState(new Date());

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

    return (
        <SafeAreaView>
            {/* <ActivityIndicator size={'large'} /> */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{
                    backgroundColor: theme.colors.background,
                    minHeight: SCREEN_HEIGHT,
                    height: "auto"
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <HeadingComp title={`Hi, ${(loginStore?.emp_name as string)?.split(" ")[0]}`} subtitle={`Welcome back ${loginStore?.id === 1 ? "Credit Officer" : "Branch Manager"}!`} background={MD2Colors.blue100} />
                <View style={{
                    // paddingHorizontal: 20,
                    // paddingBottom: 120,
                    // gap: 8
                    width: SCREEN_WIDTH,
                    // justifyContent: "center",
                    alignItems: "center"
                }}>
                    {/* <Text variant='bodyLarge'>{JSON.stringify(loginStore)}</Text> */}

                    {/* Dashboard Starts From Here... */}

                    <View style={{
                        backgroundColor: MD2Colors.blue50,
                        width: SCREEN_WIDTH / 1.1,
                        height: SCREEN_HEIGHT / 1.70,
                        borderTopRightRadius: 30,
                        borderBottomLeftRadius: 30,
                        padding: 15,
                        gap: 10,
                    }}>
                        <Text variant='bodyLarge' style={{
                            color: MD2Colors.blue900
                        }}>Branch - {loginStore?.branch_name}</Text>
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
                            }}>
                                <IconButton icon="calendar-month-outline" iconColor={theme.colors.onTertiaryContainer} onPress={() => setOpenDate(true)} />
                                <DatePicker
                                    // maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))}
                                    modal
                                    mode="date"
                                    // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
                                    open={openDate}
                                    date={choosenDate}
                                    onConfirm={date => {
                                        setOpenDate(false)
                                        setChoosenDate(date)
                                    }}
                                    onCancel={() => {
                                        setOpenDate(false)
                                    }}
                                />
                            </View>
                            <View>
                                <Icon source="arrow-left-thin" size={25} color={theme.colors.onSurface} />
                            </View>
                            <View>
                                <Text variant='titleMedium' style={{ color: theme.colors.tertiary }}>{`DATE: ${choosenDate.toLocaleDateString("en-GB")}`}</Text>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`CURRENT TIME: ${currentTime.toLocaleTimeString("en-GB")}`}</Text>
                            </View>
                        </View>

                        <View style={{
                            height: 80,
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            borderRadius: 0,
                            // borderTopRightRadius: 0,
                            // borderTopLeftRadius: 0,
                            alignItems: "center",
                            paddingHorizontal: 15,
                            flexDirection: "row",
                            gap: 15
                        }}>
                            <View style={{
                                backgroundColor: MD2Colors.green500,
                                width: 53,
                                height: 53,
                                borderWidth: 5,
                                borderColor: MD2Colors.green200,
                                borderRadius: 150,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Icon source="format-list-numbered" size={25} color={theme.colors.surface} />
                            </View>
                            <View>
                                <Text variant='titleMedium' style={{ color: MD2Colors.green500 }}>{`No. of GRTs`}</Text>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`${12} Forms`}</Text>
                            </View>
                        </View>

                        <View style={{
                            height: 80,
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            borderRadius: 0,
                            alignItems: "center",
                            paddingHorizontal: 15,
                            flexDirection: "row",
                            gap: 15
                        }}>
                            <View style={{
                                backgroundColor: MD2Colors.pink500,
                                width: 53,
                                height: 53,
                                borderWidth: 5,
                                borderColor: MD2Colors.pink200,
                                borderRadius: 150,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Icon source="cash" size={25} color={theme.colors.surface} />
                            </View>
                            <View>
                                <Text variant='titleMedium' style={{ color: MD2Colors.pink500 }}>{`Total Cash Recovery`}</Text>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`Rs. ${250000}/-`}</Text>
                            </View>
                        </View>

                        <View style={{
                            height: 80,
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            borderRadius: 20,
                            borderTopRightRadius: 0,
                            borderTopLeftRadius: 0,
                            alignItems: "center",
                            paddingHorizontal: 15,
                            flexDirection: "row",
                            gap: 15
                        }}>
                            <View style={{
                                backgroundColor: MD2Colors.blue500,
                                width: 53,
                                height: 53,
                                borderWidth: 5,
                                borderColor: MD2Colors.blue200,
                                borderRadius: 150,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Icon source="bank" size={25} color={theme.colors.surface} />
                            </View>
                            <View>
                                <Text variant='titleMedium' style={{ color: "#039ff6" }}>{`Total Bank Recovery`}</Text>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`Rs. ${6208}/-`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})