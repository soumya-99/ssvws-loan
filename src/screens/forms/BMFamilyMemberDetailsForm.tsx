import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, IconButton, Text } from 'react-native-paper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'

const BMFamilyMemberDetailsForm = () => {
    const theme = usePaperColorScheme()

    const [loading, setLoading] = useState(false)

    // Each form item has independent state now
    const [formArray, setFormArray] = useState([{
        name: '',
        relation: '',
        age: '',
        sex: 'm',
        education: '',
        studyingOrWorking: 'w',
        monthlyIncome: ''
    }])

    // Function to handle adding a new form
    const handleFormAdd = () => {
        setFormArray(prev => [
            ...prev,
            {
                name: '',
                relation: '',
                age: '',
                sex: 'm',
                education: '',
                studyingOrWorking: 'w',
                monthlyIncome: ''
            }
        ])
    }

    const handleFormRemove = (index) => {
        setFormArray(prev => prev.filter((_, i) => i !== index))
    }

    const handleInputChange = (index: number, field: string, value: any) => {
        const updatedForm = [...formArray]
        updatedForm[index][field] = value
        setFormArray(updatedForm)
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                {formArray?.map((item, i) => (
                    <View key={i} style={{ paddingTop: 10, gap: 10 }}>
                        <Text variant='titleMedium' style={{
                            color: theme.colors.primary
                        }}>Member {i + 1}</Text>
                        <Divider />

                        <InputPaper
                            label="Name"
                            leftIcon='account-edit-outline'
                            keyboardType="default"
                            value={item?.name}
                            onChangeText={(txt) => handleInputChange(i, 'name', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        <InputPaper
                            label="Relation"
                            maxLength={15}
                            leftIcon='account-cash-outline'
                            keyboardType="default"
                            value={item?.relation}
                            onChangeText={(txt) => handleInputChange(i, 'relation', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        <InputPaper
                            label="Age"
                            maxLength={3}
                            leftIcon='bag-personal-outline'
                            keyboardType="number-pad"
                            value={item?.age}
                            onChangeText={(txt) => handleInputChange(i, 'age', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        <RadioComp
                            title="Sex"
                            icon="cash-multiple"
                            dataArray={[
                                {
                                    optionName: "MALE",
                                    optionState: item?.sex,
                                    currentState: "m",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'sex', value)
                                },
                                {
                                    optionName: "FEMALE",
                                    optionState: item?.sex,
                                    currentState: "f",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'sex', value)
                                },
                            ]}
                        />

                        <InputPaper
                            label="Education"
                            maxLength={50}
                            leftIcon='account-cash-outline'
                            keyboardType="default"
                            value={item?.education}
                            onChangeText={(txt) => handleInputChange(i, 'education', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        <RadioComp
                            title="Study/Work"
                            icon="cash-multiple"
                            dataArray={[
                                {
                                    optionName: "STUDY",
                                    optionState: item?.studyingOrWorking,
                                    currentState: "s",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'studyingOrWorking', value)
                                },
                                {
                                    optionName: "WORK",
                                    optionState: item?.studyingOrWorking,
                                    currentState: "w",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'studyingOrWorking', value)
                                },
                            ]}
                        />

                        <InputPaper
                            label="Monthly Income"
                            maxLength={15}
                            leftIcon='account-cash-outline'
                            keyboardType="number-pad"
                            value={item?.monthlyIncome}
                            onChangeText={(txt) => handleInputChange(i, 'monthlyIncome', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        {formArray?.length > 1 && <IconButton icon="minus" iconColor={theme.colors.onErrorContainer} onPress={() => handleFormRemove(i)} style={{
                            alignSelf: "flex-end",
                            backgroundColor: theme.colors.errorContainer
                        }} />}
                    </View>
                ))}

                <IconButton icon="plus" iconColor={theme.colors.onTertiaryContainer} onPress={handleFormAdd} style={{
                    alignSelf: "flex-end",
                    backgroundColor: theme.colors.tertiaryContainer,
                    marginTop: formArray?.length === 1 ? 10 : 0
                }} />
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMFamilyMemberDetailsForm
