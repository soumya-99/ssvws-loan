import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Chip, Icon, Text } from "react-native-paper"
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../../components/InputPaper'
import MenuPaper from '../../components/MenuPaper'
import ButtonPaper from '../../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import { loginStorage } from '../../storage/appStorage'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
// import LoadingOverlay from '../components/LoadingOverlay'

const RecoveryGroupForm = ({ fetchedData, approvalStatus = "U" }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LOGIN DATAAA =============", loginStore)
    console.log("4444444444444444444ffffffffffffffff", fetchedData)

    const [loading, setLoading] = useState(() => false)


    const [groupBlocks, setGroupBlocks] = useState(() => [])

    const [formData, setFormData] = useState({
        groupName: "",
        groupType: "",
        groupTypeName: "",
        totalPrincipleAmount: "",
        totalInterestAmount: "",
        totalAmount: "",
    })

    const [memberDetailsArray, setMemberDetailsArray] = useState<any[]>(() => [])

    const groupTypes = [
        {
            title: "SHG",
            func: () => {
                handleFormChange("groupType", "S");
                handleFormChange("groupTypeName", "SHG")
            }
        },
        {
            title: "JLG",
            func: () => {
                handleFormChange("groupType", "J");
                handleFormChange("groupTypeName", "JLG")
            }
        }
    ]

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    useEffect(() => {
        setFormData({
            groupName: fetchedData?.group_name || "",
            groupType: fetchedData?.group_type || "",
            groupTypeName: fetchedData?.group_type === "S" ? "SHG" : fetchedData?.group_type === "J" ? "JLG" : "",
            totalPrincipleAmount: fetchedData?.total_prn_amt,
            totalInterestAmount: fetchedData?.total_intt_amt,
            totalAmount: `${+fetchedData?.total_prn_amt + +fetchedData?.total_intt_amt}`
        })
        setMemberDetailsArray(fetchedData?.memb_dtls)
        console.log("MEMB_DTLS", fetchedData?.memb_dtls)
    }, [])

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background,
            }}>
                <View style={{
                    paddingBottom: 10,
                    gap: 14
                }}>
                    <Divider />

                    <InputPaper label="Group Name" leftIcon='account-group-outline' keyboardType="default" value={formData.groupName} onChangeText={(txt: any) => handleFormChange("groupName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <List.Item
                        title="Group Type"
                        description={`Group Type: ${formData.groupTypeName}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupTypes} disabled />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <Divider />

                    {/* <InputPaper label="Total Principle Amount" maxLength={15} leftIcon='cash' keyboardType="numeric" value={formData.totalPrincipleAmount} onChangeText={(txt: any) => handleFormChange("totalPrincipleAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total Interest Amount" maxLength={15} leftIcon='cash-plus' keyboardType="numeric" value={formData.totalInterestAmount} onChangeText={(txt: any) => handleFormChange("totalInterestAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled /> */}

                    <InputPaper label="Total Outstanding (Rs.)" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.totalAmount} onChangeText={(txt: any) => handleFormChange("totalAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <Divider />

                    <View>
                        <Text variant='labelLarge' style={{
                            marginBottom: 10,
                            color: theme.colors.primary
                        }}>Members</Text>
                        <View style={{
                            flexDirection: "column",
                            gap: 8,
                            flexWrap: "wrap"
                        }}>
                            {memberDetailsArray?.map((item, i) => (
                                // <Chip style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between' }} key={i} icon="account-circle-outline" onPress={() => {
                                //     navigation.dispatch(CommonActions.navigate({
                                //         name: navigationRoutes.recoveryMemberScreen,
                                //         params: {
                                //             member_details: item,
                                //         }
                                //     }))
                                // }}
                                // >
                                //     {item?.client_name}
                                //     ({+item?.intt_amt + +item?.prn_amt}/-)
                                // </Chip>

                                <View key={i} style={{ width: "100%" }}>
                                    <List.Item
                                        titleStyle={{
                                            color: theme.colors.primary,
                                        }}
                                        descriptionStyle={{
                                            color: theme.colors.secondary,
                                        }}
                                        key={i}
                                        title={`${item?.client_name}`}
                                        description={
                                            <View>
                                                <Text style={{
                                                    color: theme.colors.green
                                                }}>Outstanding - {+item?.intt_amt + +item?.prn_amt}{(+item?.intt_amt + +item?.prn_amt) && "/-"}</Text>
                                            </View>
                                        }
                                        onPress={() => {
                                            navigation.dispatch(CommonActions.navigate({
                                                name: navigationRoutes.recoveryMemberScreen,
                                                params: {
                                                    member_details: item,
                                                }
                                            }))
                                        }}
                                        left={props => <List.Icon {...props} icon="account-circle-outline" />}
                                    // right={props => (
                                    //     <View style={{
                                    //         alignSelf: 'center'
                                    //     }}>
                                    //         <Icon
                                    //             source={item?.status === "U" ? "alpha-u-circle-outline" : "alpha-a-circle-outline"}
                                    //             size={28}
                                    //             color={item?.status === "U" ? theme.colors.error : theme.colors.green}
                                    //         />
                                    //     </View>
                                    // )}
                                    />
                                    <Divider />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View>
                        <Divider />
                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default RecoveryGroupForm

const styles = StyleSheet.create({})