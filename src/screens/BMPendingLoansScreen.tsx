import { StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import normalize, { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import BMPendingLoanFormScreen from "./BMPendingLoanFormScreen"

const BMPendingLoansScreen = () => {
    const theme = usePaperColorScheme()

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                // minHeight: SCREEN_HEIGHT,
                height: 'auto'
            }}>
                {/* <HeadingComp title="Pending Forms" subtitle="Choose Form" /> */}
                <BMPendingLoanFormScreen />
            </ScrollView>
        </SafeAreaView>
    )
}

export default BMPendingLoansScreen

const styles = StyleSheet.create({})