import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import BMBasicDetailsForm from './forms/BMBasicDetailsForm'
import GroupFormExtended from './forms/GroupFormExtended'
import { useRoute } from '@react-navigation/native'
import { SCREEN_HEIGHT } from 'react-native-normalize'

const COGroupFormExtendedScreen = () => {
    const theme = usePaperColorScheme()
    const { params } = useRoute<any>()
    // 110 -> Branch Code
    // const navigation = useNavigation()

    // const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LLLLLLLLLLLKKKKKKKKKKAAAAAAAAAAAAA", params.group_details)

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Group Form" subtitle="Group form extended" isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                }}>
                    <GroupFormExtended fetchedData={params.group_details} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default COGroupFormExtendedScreen

const styles = StyleSheet.create({})