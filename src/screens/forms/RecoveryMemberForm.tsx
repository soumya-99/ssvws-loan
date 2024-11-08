import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Chip, Text } from "react-native-paper"
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

const RecoveryMemberForm = ({ fetchedData, approvalStatus = "U" }) => {
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
        totalInterestAmount: ""
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
            totalInterestAmount: fetchedData?.total_intt_amt
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

                    <InputPaper label="Total Principle Amount" maxLength={15} leftIcon='cash' keyboardType="numeric" value={formData.totalPrincipleAmount} onChangeText={(txt: any) => handleFormChange("totalPrincipleAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total Interest Amount" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.totalInterestAmount} onChangeText={(txt: any) => handleFormChange("totalInterestAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <Divider />

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default RecoveryMemberForm

const styles = StyleSheet.create({})