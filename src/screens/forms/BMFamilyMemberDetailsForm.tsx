import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, IconButton, List, Text } from 'react-native-paper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'
import ButtonPaper from '../../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import MenuPaper from '../../components/MenuPaper'
import { loginStorage } from '../../storage/appStorage'
import { CommonActions, useNavigation } from '@react-navigation/native'

const BMFamilyMemberDetailsForm = ({ formNumber, branchCode, flag = "BM", approvalStatus = "U" }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    const [loading, setLoading] = useState(false)

    const [educations, setEducations] = useState(() => [])
    const [memberGenders, setMemberGenders] = useState(() => [])

    const [formArray, setFormArray] = useState([{
        sl_no: 0,
        name: '',
        relation: '',
        age: '',
        sex: '',
        education: '',
        studyingOrWorking: '',
        monthlyIncome: ''
    },])

    const handleFormAdd = () => {
        setFormArray(prev => [
            ...prev,
            {
                sl_no: 0,
                name: '',
                relation: '',
                age: '',
                sex: '',
                education: '',
                studyingOrWorking: '',
                monthlyIncome: ''
            }
        ])
    }

    const handleFormRemove = (index) => {
        setFormArray(prev => prev.filter((_, i) => i !== index))
    }

    const handleInputChange = (index: number, field: string, value: any) => {
        if (formArray[index]) {
            const updatedForm = [...formArray];
            updatedForm[index][field] = value;
            setFormArray(updatedForm);
        } else {
            console.error(`No form item found at index ${index}`);
        }
    };

    const fetchFamilyMemberDetails = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${ADDRESSES.FETCH_FAMILY_DETAILS}?form_no=${formNumber}&branch_code=${branchCode}`);
            console.log(">>>>>>>>>>>>>>>>>>>>", res?.data);

            if (res?.data?.suc === 1) {
                const apiData = res?.data?.msg || [];

                if (apiData?.length > 0) {
                    const transformedData = apiData.map((member, index) => ({
                        sl_no: member.sl_no || index + 1,
                        name: member.name || '',
                        relation: member.relation || '',
                        age: member.age?.toString() || '',
                        sex: member.sex || '',
                        education: member.education || '',
                        studyingOrWorking: member.studyingOrWorking || '',
                        monthlyIncome: member.monthlyIncome?.toString() || ''
                    }));
                    setFormArray(transformedData);
                }
            }
        } catch (err) {
            console.log("XXXXXXXXXXXXXXXX", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchFamilyMemberDetails()
    }, [])

    const handleFetchEducations = async () => {
        setLoading(true);
        setEducations(() => []);
        await axios.get(`${ADDRESSES.GET_EDUCATIONS}`).then(res => {
            res?.data?.forEach(item => {
                setEducations(prev => [
                    ...prev,
                    {
                        title: item?.name,
                        func: (formIndex) => handleInputChange(formIndex, "education", item?.id)
                    }
                ]);
            });
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchEducations}!", ToastAndroid.SHORT);
        });
        setLoading(false);
    }

    useEffect(() => {
        handleFetchEducations()
    }, [formArray.length])

    useEffect(() => {
        setMemberGenders([
            { title: "Male", func: (formIndex) => handleInputChange(formIndex, "sex", "M") },
            { title: "Female", func: (formIndex) => handleInputChange(formIndex, "sex", "F") },
            { title: "Others", func: (formIndex) => handleInputChange(formIndex, "sex", "O") }
        ]);
    }, [formArray.length]);

    const handleFormUpdate = async () => {
        setLoading(true)

        console.log("::::::::::::::::::::", formArray)

        const creds = {
            form_no: formNumber,
            branch_code: branchCode,
            created_by: loginStore?.emp_name,
            modified_by: loginStore?.emp_name,
            memberdtls: formArray
        }

        console.log("YYYYYYYYYYYYYYYYYYYYY", creds)

        await axios.post(`${ADDRESSES.SAVE_FAMILY_DETAILS}`, creds).then(res => {
            console.log("UUUUUUUUUUUUUUUUUUUU", res?.data)
            if (res?.data?.suc === 1) {
                ToastAndroid.show("Family member details updated successfully!", ToastAndroid.SHORT)
            }
        }).catch(err => {
            console.log("88888888888888888888", err)
        })

        setLoading(false)
    }

    const handleFinalSubmit = async () => {
        setLoading(true)
        await handleFormUpdate()

        const creds = {
            modified_by: loginStore?.emp_name,
            form_no: formNumber,
            branch_code: branchCode
        }

        await axios.post(`${ADDRESSES.FINAL_SUBMIT}`, creds).then(res => {
            ToastAndroid.show("Form sent to MIS Assistant.", ToastAndroid.SHORT)
            navigation.dispatch(CommonActions.goBack())
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting the final data.", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^", formArray)

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                {formArray?.map((item, i) => (
                    <View key={i} style={{ paddingTop: 10, gap: 10 }}>
                        {/* {console.log("BBBBBBBBBBBBBBBBBB", item, i)} */}
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
                            disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code}
                        />

                        <InputPaper
                            label="Relation"
                            maxLength={15}
                            leftIcon='account-child-outline'
                            keyboardType="default"
                            value={item?.relation}
                            onChangeText={(txt) => handleInputChange(i, 'relation', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                            disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code}
                        />

                        <InputPaper
                            label="Age"
                            maxLength={3}
                            leftIcon='account-clock-outline'
                            keyboardType="numeric"
                            value={item?.age}
                            onChangeText={(txt) => handleInputChange(i, 'age', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                            disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code}
                        />

                        <List.Item
                            title="Choose Gender"
                            description={`Gender: ${item.sex}`}
                            left={props => <List.Icon {...props} icon="gender-male-female" />}
                            right={props => {
                                return <MenuPaper menuArrOfObjects={memberGenders.map(gender => ({
                                    ...gender,
                                    func: () => gender.func(i)  // Pass current form index (i)
                                }))} disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code} />
                            }}
                            descriptionStyle={{
                                color: theme.colors.tertiary,
                            }}
                        />

                        {/* {console.log("====++++===+++===", educations.map(education => ({
                            ...education,
                            func: () => education.func(i)  // Pass current form index (i)
                        })))} */}

                        <List.Item
                            title="Choose Education"
                            description={`Education: ${item.education}`}
                            left={props => <List.Icon {...props} icon="book-education-outline" />}
                            right={props => {
                                return <MenuPaper menuArrOfObjects={educations.map(education => ({
                                    ...education,
                                    func: () => education.func(i)  // Pass current form index (i)
                                }))} disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code} />
                            }}
                            descriptionStyle={{
                                color: theme.colors.tertiary,
                            }}
                        />

                        <RadioComp
                            title="Study/Work"
                            icon="office-building-cog-outline"
                            dataArray={[
                                {
                                    optionName: "STUDY",
                                    optionState: item?.studyingOrWorking,
                                    currentState: "Studying",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'studyingOrWorking', value)
                                },
                                {
                                    optionName: "WORK",
                                    optionState: item?.studyingOrWorking,
                                    currentState: "Working",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'studyingOrWorking', value)
                                },
                            ]}
                            disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code}
                        />

                        <InputPaper
                            label="Monthly Income"
                            maxLength={15}
                            leftIcon='account-cash-outline'
                            keyboardType="numeric"
                            value={item?.monthlyIncome}
                            onChangeText={(txt) => handleInputChange(i, 'monthlyIncome', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                            disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code}
                        />

                        {formArray?.length > 1 && <IconButton icon="minus" iconColor={theme.colors.onErrorContainer} onPress={() => handleFormRemove(i)} style={{
                            alignSelf: "flex-end",
                            backgroundColor: theme.colors.errorContainer
                        }} disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code} />}
                    </View>
                ))}

                <IconButton icon="plus" iconColor={theme.colors.onTertiaryContainer} onPress={() => handleFormAdd()} style={{
                    alignSelf: "flex-end",
                    backgroundColor: theme.colors.tertiaryContainer,
                    marginTop: formArray?.length === 1 ? 10 : 0
                }} disabled={flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code} />

                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingTop: 10,
                    paddingBottom: 10
                }}>
                    <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={() => {
                        Alert.alert("Update Family Members Details", "Are you sure you want to update this?", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleFormUpdate() },
                        ])
                    }} disabled={loading || flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code}
                        loading={loading}>UPDATE</ButtonPaper>

                    <ButtonPaper mode='contained-tonal' icon="send-circle-outline" onPress={() => {
                        Alert.alert("Final Submit", "Are you sure you want to finalize the whole form and send to MIS Assistant? Make sure you updated all the details properly. The action is not revertable.", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleFinalSubmit() },
                        ])
                    }} disabled={loading || flag === "CO" || approvalStatus !== "U" || branchCode !== loginStore?.brn_code}
                        loading={loading}>FINAL SUBMIT</ButtonPaper>
                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMFamilyMemberDetailsForm
