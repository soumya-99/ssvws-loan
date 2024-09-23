import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeadingComp from '../components/HeadingComp'
import { usePaperColorScheme } from '../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../components/InputPaper'
import MenuPaper from '../components/MenuPaper'
import { SCREEN_HEIGHT } from "react-native-normalize"
import ButtonPaper from '../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { loginStorage } from '../storage/appStorage'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'

const GroupFormScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LOGIN DATAAA =============", loginStore)

    const [groupName, setGroupName] = useState(() => "")
    const [groupType, setGroupType] = useState(() => "")
    const [address, setAddress] = useState(() => "")
    const [phoneNo, setPhoneNo] = useState(() => "")
    const [emailId, setEmailId] = useState(() => "")

    const groupTypes = [{ title: "SHG", func: () => setGroupType("S") }, { title: "JLG", func: () => setGroupType("J") }]

    const handleSubmitGroupDetails = async () => {
        // console.log("Group created!")

        const creds = {
            branch_code: loginStore?.brn_code,
            group_name: groupName,
            group_type: groupType,
            grp_addr: address,
            co_id: loginStore?.emp_id,
            phone1: phoneNo,
            phone2: phoneNo,
            email_id: emailId,
            disctrict: +loginStore?.dist_id,
            block: loginStore?.block_id,
            created_by: loginStore?.emp_name
        }

        console.log("GROUPPPP-----CREDSSSS", creds)

        await axios.post(`${ADDRESSES.SAVE_GROUP}`, creds).then(res => {
            console.log("GROUP CREATION ==============", res?.data)
            ToastAndroid.show("Group created successfully!", ToastAndroid.SHORT)
            navigation.dispatch(CommonActions.navigate({
                name: navigationRoutes.homeScreen
            }))
        }).catch(err => {
            ToastAndroid.show("Some error occurred while saving group.", ToastAndroid.SHORT)
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Create Group" subtitle="Fill Details" />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 5,
                    gap: 10,
                }}>
                    <Divider />

                    <InputPaper label="Group Name" leftIcon='account-group-outline' keyboardType="default" value={groupName} onChangeText={(txt: any) => setGroupName(txt)} />

                    <List.Item
                        title="Choose Group Type"
                        description={`Group Type: ${groupType}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupTypes} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    <InputPaper label="Address" leftIcon='card-account-phone-outline' keyboardType="default" value={address} onChangeText={(txt: any) => setAddress(txt)} />
                    <InputPaper label="Mobile No." maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={phoneNo} onChangeText={(txt: any) => setPhoneNo(txt)} />
                    <InputPaper label="Email Id." leftIcon='email-outline' keyboardType="email-address" value={emailId} onChangeText={(txt: any) => setEmailId(txt)} />

                    <View style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="account-multiple-plus-outline" mode="contained" onPress={() => {
                            Alert.alert(`Create group ${groupName}?`, `Are you sure, you want to create this group under this type ${groupType}?`, [{
                                onPress: () => handleSubmitGroupDetails(),
                                text: "Yes"
                            }, {
                                onPress: () => null,
                                text: "No"
                            }])

                        }}>
                            ADD GROUP
                        </ButtonPaper>
                        <ButtonPaper icon="arrow-right-bottom-bold" mode="contained-tonal" onPress={() => navigation.dispatch(CommonActions.navigate({
                            name: navigationRoutes.homeScreen
                        }))}>
                            GO TO GRT
                        </ButtonPaper>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GroupFormScreen

const styles = StyleSheet.create({})