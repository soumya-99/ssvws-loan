import { StyleSheet, SafeAreaView, View, ScrollView, TextStyle, ViewStyle } from 'react-native'
import { DataTable, Text } from "react-native-paper"
import React, { useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import HeadingComp from "../../components/HeadingComp"
import CollectionButtonsWrapper from "../../components/CollectionButtonsWrapper"
import CollectionButton from "../../components/CollectionButton"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
import { loginStorage } from '../../storage/appStorage'
import ButtonPaper from '../../components/ButtonPaper'
import SurfacePaper from '../../components/SurfacePaper'
import DatePicker from 'react-native-date-picker'

const RecoveryReportScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [fromDate, setFromDate] = useState(() => new Date())
    const [toDate, setToDate] = useState(() => new Date())
    const [openFromDate, setOpenFromDate] = useState(() => false)
    const [openToDate, setOpenToDate] = useState(() => false)

    const titleTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer
    }

    const titleStyle: ViewStyle = {
        backgroundColor: theme.colors.primaryContainer
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Recovery Report" subtitle="View recovery report" isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    gap: 10
                }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 15,
                            alignItems: "center",
                            backgroundColor: theme.colors.tertiaryContainer,
                            padding: 2,
                            borderRadius: 12
                        }}>
                        <ButtonPaper
                            textColor={theme.colors.onTertiaryContainer}
                            onPress={() => setOpenFromDate(true)}
                            mode="text">
                            FROM: {fromDate?.toLocaleDateString("en-GB")}
                        </ButtonPaper>
                        <ButtonPaper
                            textColor={theme.colors.onTertiaryContainer}
                            onPress={() => setOpenToDate(true)}
                            mode="text">
                            TO: {toDate?.toLocaleDateString("en-GB")}
                        </ButtonPaper>

                        <DatePicker
                            modal
                            mode="date"
                            // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
                            open={openFromDate}
                            date={fromDate}
                            onConfirm={date => {
                                setOpenFromDate(false)
                                setFromDate(date)
                            }}
                            onCancel={() => {
                                setOpenFromDate(false)
                            }}
                        />
                        <DatePicker
                            modal
                            mode="date"
                            open={openToDate}
                            date={toDate}
                            onConfirm={date => {
                                setOpenToDate(false)
                                setToDate(date)
                            }}
                            onCancel={() => {
                                setOpenToDate(false)
                            }}
                        />
                    </View>

                    <View>
                        <ButtonPaper
                            onPress={() => null}
                            mode="contained-tonal"
                            buttonColor={theme.colors.secondaryContainer}
                            textColor={theme.colors.onSecondaryContainer}
                        // loading={isLoading}
                        // disabled={isDisabled}
                        >
                            SUBMIT
                        </ButtonPaper>
                    </View>

                    <View>
                        <SurfacePaper backgroundColor={theme.colors.surface}>
                            {/* <ScrollView horizontal> */}
                            <DataTable>
                                <DataTable.Header style={titleStyle}>
                                    <DataTable.Title textStyle={titleTextStyle}>Sl. No.</DataTable.Title>
                                    <DataTable.Title textStyle={titleTextStyle}>Group</DataTable.Title>
                                    <DataTable.Title textStyle={titleTextStyle}>Member</DataTable.Title>
                                    <DataTable.Title textStyle={titleTextStyle} numeric>Credit</DataTable.Title>
                                </DataTable.Header>

                                {[{ group_name: "Kojagori", client_name: "Tiyasha Barui", credit: 8005 }, { group_name: "Kojagori", client_name: "Tiyasha Barui", credit: 8005 }].map((item, index) => {
                                    return (
                                        <DataTable.Row key={index}>
                                            <DataTable.Cell>
                                                {index + 1}
                                            </DataTable.Cell>
                                            <DataTable.Cell>
                                                {item?.group_name
                                                    ?.toString()
                                                }
                                            </DataTable.Cell>
                                            <DataTable.Cell>
                                                {item?.client_name
                                                    ?.toString()
                                                }
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {item?.credit}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    )
                                })}
                            </DataTable>
                            {/* </ScrollView> */}
                            {/* <View style={{ padding: normalize(10) }}>
                                <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                                    TOTAL NET: {212112?.toFixed(2)}  CANCELLED: ₹{12021?.toFixed(2)}
                                </Text>
                            </View> */}
                        </SurfacePaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RecoveryReportScreen

const styles = StyleSheet.create({})