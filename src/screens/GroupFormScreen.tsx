import { SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import HeadingComp from '../components/HeadingComp'
import { usePaperColorScheme } from '../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../components/InputPaper'
import MenuPaper from '../components/MenuPaper'
import { SCREEN_HEIGHT } from "react-native-normalize"
import ButtonPaper from '../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'

const GroupFormScreen = () => {
    const theme = usePaperColorScheme()

    const [groupName, setGroupName] = useState(() => "")
    const [groupType, setGroupType] = useState(() => "")
    const [address, setAddress] = useState(() => "")
    const [phoneNo, setPhoneNo] = useState(() => "")
    const [emailId, setEmailId] = useState(() => "")

    // const [emailId, setEmailId] = useState(() => "")

    const groupTypes = [{ title: "SHG", func: () => setGroupType("SHG") }, { title: "JLG", func: () => setGroupType("JLG") }]

    const handleSubmitGroupDetails = async () => {
        // console.log("Group created!")

        const creds = {
            "branch_code": "",
            "group_name": "",
            "group_type": "",
            "grp_addr": "",
            "phone1": "",
            "phone2": "",
            "email_id": "",
            "district": "",
            "block": "",
            "created_by": ""
        }

        await axios.post(`${ADDRESSES.SAVE_GROUP}`, creds).then(res => {
            console.log("GROUP CREATION", res?.data)
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

                    <InputPaper label="Group Name" keyboardType="default" value={groupName} onChangeText={(txt: any) => setGroupName(txt)} />

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

                    <InputPaper label="Address" keyboardType="default" value={address} onChangeText={(txt: any) => setAddress(txt)} />
                    <InputPaper label="Mobile No." keyboardType="phone-pad" value={phoneNo} onChangeText={(txt: any) => setPhoneNo(txt)} />
                    <InputPaper label="Email Id." keyboardType="email-address" value={emailId} onChangeText={(txt: any) => setEmailId(txt)} />

                    <ButtonPaper icon="account-multiple-plus-outline" mode="contained" onPress={handleSubmitGroupDetails} style={{
                        marginBottom: 10
                    }}>
                        ADD GROUP
                    </ButtonPaper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GroupFormScreen

const styles = StyleSheet.create({})