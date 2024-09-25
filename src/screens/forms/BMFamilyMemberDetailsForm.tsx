import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, IconButton, List, RadioButton, Text } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'

const BMFamilyMemberDetailsForm = () => {
    const theme = usePaperColorScheme()

    const [loading, setLoading] = useState(() => false)

    const [name, setName] = useState(() => "")
    const [relation, setRelation] = useState(() => "")
    const [age, setAge] = useState(() => "")
    const [education, setEducation] = useState(() => "")
    const [sex, setSex] = useState(() => 'm')
    const [studyingOrWorking, setStudyingOrWorking] = useState(() => 'w')
    const [monthlyIncome, setMonthlyIncome] = useState(() => "")

    // const [formObject, setFormObject] = useState({name:"",relation:"",age:"",education:"",sex:"",studyingOrWorking:"",monthlyIncome:""})
    // const [relation, setRelation] = useState(() => "")
    // const [age, setAge] = useState(() => "")
    // const [education, setEducation] = useState(() => "")
    // const [sex, setSex] = useState(() => 'm')
    // const [studyingOrWorking, setStudyingOrWorking] = useState(() => 'w')
    // const [monthlyIncome, setMonthlyIncome] = useState(() => "")


    const formArrayObject = {
        name,
        setName,
        relation,
        setRelation,
        age,
        setAge,
        sex,
        setSex,
        education,
        setEducation,
        studyingOrWorking,
        setStudyingOrWorking,
        monthlyIncome,
        setMonthlyIncome
    }

    const [formArray, setFormArray] = useState(() => [formArrayObject])

    const handleFormAdd = () => {
        setFormArray(prev => [...prev, {
            name,
            setName,
            relation,
            setRelation,
            age,
            setAge,
            sex,
            setSex,
            education,
            setEducation,
            studyingOrWorking,
            setStudyingOrWorking,
            monthlyIncome,
            setMonthlyIncome
        }])
    }

    const handleFormRemove = (index) => {
        setFormArray(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                {formArray?.map((item, i) => (
                    <>
                        <View style={{
                            paddingTop: 10,
                            gap: 10,
                        }}>
                            <Divider />

                            <InputPaper label="Name" leftIcon='bag-personal-outline' keyboardType="default" value={item?.name} onChangeText={(txt: any) => item?.setName(txt)} customStyle={{
                                backgroundColor: theme.colors.background,
                            }} />

                            <InputPaper label="Relation" maxLength={15} leftIcon='account-cash-outline' keyboardType="default" value={item?.relation} onChangeText={(txt: any) => item?.setRelation(txt)} customStyle={{
                                backgroundColor: theme.colors.background,
                            }} />

                            <InputPaper label="Age" maxLength={3} leftIcon='bag-personal-outline' keyboardType="number-pad" value={item?.age} onChangeText={(txt: any) => item?.setAge(txt)} customStyle={{
                                backgroundColor: theme.colors.background,
                            }} />

                            <RadioComp
                                title="Sex"
                                icon="cash-multiple"
                                dataArray={[
                                    {
                                        optionName: "MALE",
                                        optionState: item?.sex,
                                        currentState: "m",
                                        optionSetStateDispathFun: item?.setSex
                                    },
                                    {
                                        optionName: "FEMALE",
                                        optionState: item?.sex,
                                        currentState: "f",
                                        optionSetStateDispathFun: item?.setSex
                                    },
                                ]}
                            />

                            <InputPaper label="Education" maxLength={50} leftIcon='account-cash-outline' keyboardType="default" value={item?.education} onChangeText={(txt: any) => item?.setEducation(txt)} customStyle={{
                                backgroundColor: theme.colors.background,
                            }} />

                            <RadioComp
                                title="Study/Work"
                                icon="cash-multiple"
                                dataArray={[
                                    {
                                        optionName: "STUDY",
                                        optionState: item?.studyingOrWorking,
                                        currentState: "s",
                                        optionSetStateDispathFun: item?.setStudyingOrWorking
                                    },
                                    {
                                        optionName: "WORK",
                                        optionState: item?.studyingOrWorking,
                                        currentState: "w",
                                        optionSetStateDispathFun: item?.setStudyingOrWorking
                                    },
                                ]}
                            />

                            <InputPaper label="Monthly Income" maxLength={15} leftIcon='account-cash-outline' keyboardType="number-pad" value={item?.monthlyIncome} onChangeText={(txt: any) => item?.setMonthlyIncome(txt)} customStyle={{
                                backgroundColor: theme.colors.background,
                            }} />
                        </View>
                        <IconButton icon="minus" iconColor={theme.colors.error} onPress={() => handleFormRemove(i)} />
                    </>
                ))}

                <IconButton icon="plus" iconColor={theme.colors.primary} onPress={() => handleFormAdd()} />
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMFamilyMemberDetailsForm

const styles = StyleSheet.create({})