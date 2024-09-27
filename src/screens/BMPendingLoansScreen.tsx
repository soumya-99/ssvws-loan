import { StyleSheet, SafeAreaView, ScrollView, View, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import normalize, { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import BMPendingLoanFormScreen from "./BMPendingLoanFormScreen"
import { Divider, List, Searchbar, Text } from 'react-native-paper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'

const BMPendingLoansScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    const [search, setSearch] = useState(() => "")
    const [formsData, setFormsData] = useState(() => [])
    const [filteredDataArray, setFilteredDataArray] = useState(() => [])


    const fetchPendingGRTForms = async () => {
        setLoading(true)

        await axios.get(`${ADDRESSES.FETCH_FORMS}?branch_code=${loginStore?.brn_code}`).then(res => {
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg)
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching forms list!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    useEffect(() => {
        fetchPendingGRTForms()
    }, [])

    useEffect(() => {
        setFilteredDataArray(formsData)
    }, [formsData])

    const handleFormListClick = (formNo: any, brCode: any) => {
        console.log("HIIIII")
        navigation.dispatch(CommonActions.navigate({
            name: navigationRoutes.bmPendingLoanFormScreen,
            params: {
                formNumber: formNo,
                branchCode: brCode
            }
        }))
    }

    const onChangeSearch = (query: string) => {
        if (/^\d*$/.test(query)) {
            setSearch(query)
            const filteredData = formsData.filter((item) => {
                return item?.form_no?.toString().includes(query)
            })
            setFilteredDataArray(filteredData)
        } else {
            setFilteredDataArray(formsData)
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                minHeight: SCREEN_HEIGHT,
                height: 'auto',
            }} keyboardShouldPersistTaps="handled">
                <HeadingComp title="Pending Forms" subtitle="Choose Form" />
                {/* <BMPendingLoanFormScreen /> */}

                <View style={{
                    paddingHorizontal: 20
                }}>
                    <Searchbar
                        autoFocus
                        placeholder={"Search by Form Number"}
                        onChangeText={onChangeSearch}
                        value={search}
                        elevation={search ? 2 : 0}
                        keyboardType={"numeric"}
                        maxLength={18}
                        style={{
                            backgroundColor: theme.colors.tertiaryContainer,
                            color: theme.colors.onTertiaryContainer,
                        }}
                    // loading={search ? true : false}
                    />
                </View>

                <View style={{
                    padding: 20,
                    paddingBottom: 120
                }}>
                    {filteredDataArray?.map((item, i) => (
                        <React.Fragment key={i}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                key={i}
                                title={`${item?.form_no}`}
                                description={`Branch Code: ${item?.branch_code}`}
                                onPress={() => handleFormListClick(item?.form_no, item?.branch_code)}
                                left={props => <List.Icon {...props} icon="form-select" />}
                            //   right={props => (
                            //     <Text
                            //       variant="bodyMedium"
                            //       {...props}
                            //       style={{ color: theme.colors.tertiary }}>
                            //       ₹{item?.net_amt}
                            //     </Text>
                            //   )}
                            // right={props => (
                            //   <List.Icon {...props} icon="download" />
                            // )}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BMPendingLoansScreen

const styles = StyleSheet.create({})