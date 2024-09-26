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
import BMHouseholdDetailsForm from "./forms/BMHouseholdDetailsForm"
import BMFamilyMemberDetailsForm from "./forms/BMFamilyMemberDetailsForm"

const BMPendingLoanFormScreen = () => {
    const theme = usePaperColorScheme()

    const [currentPosition, setCurrentPosition] = useState(() => 0)

    const labels = ["Basic Details", "Occupation Details", "Household Details", "Family Member Details"];

    const customStyles = {
        stepIndicatorSize: 40,
        currentStepIndicatorSize: 45,
        separatorStrokeWidth: 3,
        currentStepStrokeWidth: 5,
        stepStrokeCurrentColor: theme.colors.greenContainer,
        stepStrokeWidth: 2,
        stepStrokeFinishedColor: theme.colors.green,
        stepStrokeUnFinishedColor: theme.colors.outlineVariant,
        separatorFinishedColor: theme.colors.onGreenContainer,
        separatorUnFinishedColor: theme.colors.outline,
        stepIndicatorFinishedColor: theme.colors.green,
        stepIndicatorUnFinishedColor: theme.colors.surface,
        stepIndicatorCurrentColor: theme.colors.surface,
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: theme.colors.onBackground,
        stepIndicatorLabelFinishedColor: theme.colors.green,
        stepIndicatorLabelUnFinishedColor: theme.colors.surface,
        labelColor: theme.colors.secondary,
        labelSize: 13,
        currentStepLabelColor: theme.colors.green,
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                // minHeight: SCREEN_HEIGHT,
                height: 'auto'
            }}>
                <HeadingComp title="GRT Form" subtitle="Form no. 2024001001" />
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
                        renderStepIndicator={
                            ({ position, stepStatus }) =>
                                position === 0
                                    ? <Icon size={20} source="account" color={stepStatus === "current" || stepStatus === "unfinished" ? theme.colors.green : theme.colors.greenContainer} />
                                    : position === 1
                                        ? <Icon size={20} source="office-building-outline" color={stepStatus === "current" || stepStatus === "unfinished" ? theme.colors.green : theme.colors.greenContainer} />
                                        : position === 2
                                            ? <Icon size={20} source="home-city-outline" color={stepStatus === "current" || stepStatus === "unfinished" ? theme.colors.green : theme.colors.greenContainer} />
                                            : position === 3
                                                ? <Icon size={20} source="human-male-female-child" color={stepStatus === "current" || stepStatus === "unfinished" ? theme.colors.green : theme.colors.greenContainer} />
                                                : null
                        }
                    />

                    {currentPosition === 0 && <BMBasicDetailsForm />}
                    {currentPosition === 1 && <BMOccupationDetailsForm />}
                    {currentPosition === 2 && <BMHouseholdDetailsForm />}
                    {currentPosition === 3 && <BMFamilyMemberDetailsForm />}

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

export default BMPendingLoanFormScreen

const styles = StyleSheet.create({})