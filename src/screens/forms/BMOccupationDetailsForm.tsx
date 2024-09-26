import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, List, RadioButton, Text } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import ButtonPaper from '../../components/ButtonPaper'

const BMOccupationDetailsForm = ({ formNumber, branchCode }) => {
    const theme = usePaperColorScheme()

    const [loading, setLoading] = useState(() => false)

    const [purposesOfLoan, setPurposesOfLoan] = useState(() => [])
    const [subPurposesOfLoan, setSubPurposesOfLoan] = useState(() => [])

    const [formData, setFormData] = useState({
        selfOccupation: "",
        selfMonthlyIncome: "",
        spouseOccupation: "",
        spouseMonthlyIncome: "",
        purposeOfLoan: "",
        purposeOfLoanName: "",
        subPurposeOfLoan: "",
        subPurposeOfLoanName: "",
        amountApplied: "",
        checkOtherOngoingLoan: "N",
        otherLoanAmount: "",
        monthlyEmi: "",
    })

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const fetchPurposeOfLoan = async () => {
        setPurposesOfLoan([]);
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_PURPOSE_OF_LOAN}`).then(res => {
            // purp_id
            if (res?.data?.suc === 1) {
                res?.data?.msg?.map((item, _) => (
                    setPurposesOfLoan(prev => [...prev, { title: item?.purpose_id, func: () => { handleFormChange("purposeOfLoan", item?.purp_id); handleFormChange("purposeOfLoanName", item?.purpose_id) } }])
                ))
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching Purposes of Loan!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const fetchSubPurposeOfLoan = async () => {
        setSubPurposesOfLoan([]);
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_SUB_PURPOSE_OF_LOAN}?purp_id=${formData.purposeOfLoan}`).then(res => {
            if (res?.data?.suc === 1) {
                res?.data?.msg?.map((item, _) => (
                    setSubPurposesOfLoan(prev => [...prev, { title: item?.sub_purp_name, func: () => { handleFormChange("subPurposeOfLoan", item?.sub_purp_id); handleFormChange("subPurposeOfLoanName", item?.sub_purp_name) } }])
                ))
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching Sub Purposes of Loan!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    useEffect(() => {
        fetchPurposeOfLoan()
    }, [])

    useEffect(() => {
        fetchSubPurposeOfLoan()
    }, [formData.purposeOfLoan])

    const handleFormUpdate = async () => {
        const creds = {
            "form_no": formNumber,
            "self_occu": formData.selfOccupation,
            "self_income": formData.selfMonthlyIncome,
            "spouse_occu": formData.spouseOccupation,
            "spouse_income": formData.spouseMonthlyIncome,
            "loan_purpose": formData.purposeOfLoan,
            "sub_pupose": formData.subPurposeOfLoan,
            "applied_amt": formData.amountApplied,
            "other_loan_flag": "",
            "other_loan_amt": "",
            "other_loan_emi": "",
            "political_flag": "",
            "parental_addr": "",
            "parental_phone": "",
            "modified_by": "",
            "created_by": ""
        }
        await axios.post(`${ADDRESSES.SAVE_OCCUPATION_DETAILS}`, creds)
    }

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

                    <InputPaper label="Self Occupation" maxLength={50} leftIcon='bag-personal-outline' keyboardType="default" value={formData.selfOccupation} onChangeText={(txt: any) => handleFormChange("selfOccupation", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Self Monthly Income" maxLength={15} leftIcon='account-cash-outline' keyboardType="numeric" value={formData.selfMonthlyIncome} onChangeText={(txt: any) => handleFormChange("selfMonthlyIncome", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Spouse Occupation" maxLength={50} leftIcon='bag-personal-outline' keyboardType="default" value={formData.spouseOccupation} onChangeText={(txt: any) => handleFormChange("spouseOccupation", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Spouse Monthly Income" maxLength={15} leftIcon='account-cash-outline' keyboardType="numeric" value={formData.spouseMonthlyIncome} onChangeText={(txt: any) => handleFormChange("spouseMonthlyIncome", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    {/* <InputPaper label="Purpose of Loan" multiline leftIcon='form-textbox' value={purposeOfLoan} onChangeText={(txt: any) => setPurposeOfLoan(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} /> */}
                    <List.Item
                        title="Purpose of Loan"
                        description={`Purpose: ${formData.purposeOfLoanName}`}
                        left={props => <List.Icon {...props} icon="progress-question" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={purposesOfLoan} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <List.Item
                        title="Sub Purpose"
                        description={`Purpose: ${formData.subPurposeOfLoanName}`}
                        left={props => <List.Icon {...props} icon="file-question-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={subPurposesOfLoan} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <InputPaper label="Amount Applied" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.amountApplied} onChangeText={(txt: any) => handleFormChange("amountApplied", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <RadioComp
                        title="Other Loans?"
                        icon="cash-multiple"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: formData.checkOtherOngoingLoan,
                                currentState: "yes",
                                optionSetStateDispathFun: (e) => handleFormChange("checkOtherOngoingLoan", e)
                            },
                            {
                                optionName: "NO",
                                optionState: formData.checkOtherOngoingLoan,
                                currentState: "no",
                                optionSetStateDispathFun: (e) => handleFormChange("checkOtherOngoingLoan", e)
                            },
                        ]}
                    />

                    {formData.checkOtherOngoingLoan === "yes" && <InputPaper label="Other Loan Amount" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.otherLoanAmount} onChangeText={(txt: any) => handleFormChange("otherLoanAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />}

                    <InputPaper label="Monthly EMI" maxLength={15} leftIcon='cash-check' keyboardType="numeric" value={formData.monthlyEmi} onChangeText={(txt: any) => handleFormChange("monthlyEmi", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={() => {
                        Alert.alert("Update Basic Details", "Are you sure you want to update this?", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleFormUpdate() },
                        ])
                    }} disabled={loading}
                        loading={loading}>UPDATE</ButtonPaper>

                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMOccupationDetailsForm

const styles = StyleSheet.create({})