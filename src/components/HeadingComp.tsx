import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import { usePaperColorScheme } from "../theme/theme"

const HeadingComp = ({
    title,
    subtitle
}) => {
    const theme = usePaperColorScheme()

    return (
        <View style={{
            backgroundColor: theme.colors.primaryContainer,
            margin: 20,
            paddingVertical: 30,
            borderTopLeftRadius: 30,
            borderBottomRightRadius: 30
        }}>
            <View style={{
                padding: 15,
            }}>
                <Text variant="headlineLarge" style={{
                    color: theme.colors.onSecondaryContainer,
                    // textAlign: "left",
                }}>{title}</Text>
                <Text variant="bodyLarge" style={{
                    color: theme.colors.onSecondaryContainer,
                    // textAlign: "left",
                }}>{subtitle}</Text>
            </View>

        </View>
    )
}

export default HeadingComp

const styles = StyleSheet.create({})