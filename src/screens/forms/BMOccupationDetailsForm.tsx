import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, List, RadioButton, Text } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'

const BMOccupationDetailsForm = () => {
    const theme = usePaperColorScheme()

    const [loading, setLoading] = useState(() => false)

    const [selfOccupation, setSelfOccupation] = useState(() => "")
    const [selfMonthlyIncome, setSelfMonthlyIncome] = useState(() => "")
    const [spouseOccupation, setSpouseOccupation] = useState(() => "")
    const [spouseMonthlyIncome, setSpouseMonthlyIncome] = useState(() => "")
    const [purposesOfLoan, setPurposesOfLoan] = useState(() => [])
    const [purposeOfLoan, setPurposeOfLoan] = useState(() => "")
    const [amountApplied, setAmountApplied] = useState(() => "")
    const [checkOtherOngoingLoan, setCheckOtherOngoingLoan] = useState(() => 'yes')
    const [monthlyEmi, setMonthlyEmi] = useState(() => "")

    useEffect(() => {
        setPurposesOfLoan([]);

        [{ purpose: "Some Reason 1", value: "1" }, { purpose: "Some Reason 2", value: "2" }]?.map((item, i) => (
            //@ts-ignore
            setPurposesOfLoan(prev => [...prev, { title: item?.purpose, func: () => setPurposeOfLoan(item?.value) }])
        ))
    }, [])


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

                    <InputPaper label="Self Occupation" maxLength={10} leftIcon='bag-personal-outline' keyboardType="default" value={selfOccupation} onChangeText={(txt: any) => setSelfOccupation(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Self Monthly Income" maxLength={15} leftIcon='account-cash-outline' keyboardType="number-pad" value={selfMonthlyIncome} onChangeText={(txt: any) => setSelfMonthlyIncome(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Spouse Occupation" maxLength={10} leftIcon='bag-personal-outline' keyboardType="default" value={spouseOccupation} onChangeText={(txt: any) => setSpouseOccupation(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Spouse Monthly Income" maxLength={15} leftIcon='account-cash-outline' keyboardType="number-pad" value={spouseMonthlyIncome} onChangeText={(txt: any) => setSpouseMonthlyIncome(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    {/* <InputPaper label="Purpose of Loan" multiline leftIcon='form-textbox' value={purposeOfLoan} onChangeText={(txt: any) => setPurposeOfLoan(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} /> */}
                    <List.Item
                        title="Purpose of Loan"
                        description={`Purpose: ${purposeOfLoan}`}
                        left={props => <List.Icon {...props} icon="progress-question" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={purposesOfLoan} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <InputPaper label="Amount Applied" maxLength={15} leftIcon='cash-100' keyboardType="number-pad" value={amountApplied} onChangeText={(txt: any) => setAmountApplied(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                    }}>
                        <View>
                            <Text variant='bodyLarge'>Other Ongoing Loans?</Text>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5
                        }}>
                            <Text>YES</Text>
                            <RadioButton
                                value="yes"
                                status={checkOtherOngoingLoan === 'yes' ? 'checked' : 'unchecked'}
                                onPress={() => setCheckOtherOngoingLoan('first')}
                            />
                            <Text>NO</Text>
                            <RadioButton
                                value="no"
                                status={checkOtherOngoingLoan === 'no' ? 'checked' : 'unchecked'}
                                onPress={() => setCheckOtherOngoingLoan('no')}
                            />
                        </View>
                    </View>

                    <Divider />

                    <InputPaper label="Monthly EMI" maxLength={15} leftIcon='cash-check' keyboardType="number-pad" value={monthlyEmi} onChangeText={(txt: any) => setMonthlyEmi(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMOccupationDetailsForm

const styles = StyleSheet.create({})