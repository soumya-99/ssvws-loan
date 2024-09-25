import { StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import normalize, { SCREEN_HEIGHT } from 'react-native-normalize'
import StepIndicator from 'react-native-step-indicator'
import HeadingComp from '../components/HeadingComp'
import ButtonPaper from '../components/ButtonPaper'
import { Icon } from 'react-native-paper'
import BMBasicDetailsForm from "./forms/BMBasicDetailsForm"
import BMOccupationDetailsForm from "./forms/BMOccupationDetailsForm"

const BMPendingLoansScreen = () => {
    const theme = usePaperColorScheme()

    const [currentPosition, setCurrentPosition] = useState(() => 0)

    const labels = ["Basic Details", "Occupation Details", "Household Details", "Family Member Details"];

    const customStyles = {
        stepIndicatorSize: 40,
        currentStepIndicatorSize: 45,
        separatorStrokeWidth: 3,
        currentStepStrokeWidth: 5,
        stepStrokeCurrentColor: "green",
        stepStrokeWidth: 2,
        stepStrokeFinishedColor: 'green',
        stepStrokeUnFinishedColor: '#CCCCCC',
        separatorFinishedColor: "forestgreen",
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: 'green',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: "white",
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: "#000000",
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: theme.colors.secondary,
        labelSize: 13,
        currentStepLabelColor: "green",
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                // minHeight: SCREEN_HEIGHT,
                height: 'auto'
            }}>
                <HeadingComp title="Pending Forms" subtitle="Choose Form" />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10,
                    // minHeight: SCREEN_HEIGHT,
                    paddingBottom: 20,
                    height: "auto",
                    justifyContent: "space-between",
                    alignItems: "stretch"
                }}>
                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={currentPosition}
                        labels={labels}
                        stepCount={4}
                        renderStepIndicator={({ position }) => position === 0 && <Icon size={20} source="account" color='green' />}
                    />

                    {currentPosition === 0 && <BMBasicDetailsForm />}
                    {currentPosition === 1 && <BMOccupationDetailsForm />}

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <ButtonPaper mode='outlined' icon="arrow-left-thick" onPress={() => setCurrentPosition(prev => prev - 1)} disabled={currentPosition === 0}>PREVIOUS</ButtonPaper>
                        <ButtonPaper mode='text' icon="arrow-right-bold-outline" onPress={() => setCurrentPosition(prev => prev + 1)} disabled={currentPosition === 3}>NEXT</ButtonPaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BMPendingLoansScreen

const styles = StyleSheet.create({})