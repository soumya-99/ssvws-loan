import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import React from 'react'
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from '@react-navigation/native'

const HeadingComp = ({
    title,
    subtitle,
    background = "",
    isBackEnabled = false,
}) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    return (
        <View style={{
            backgroundColor: background || theme.colors.primaryContainer,
            margin: 20,
            paddingVertical: 30,
            borderTopLeftRadius: 30,
            borderBottomRightRadius: 30
        }}>
            {isBackEnabled && <View style={{
                position: "absolute"
            }}>
                <IconButton icon="arrow-left" iconColor={theme.colors.onSecondaryContainer} size={20} onPress={() => navigation.dispatch(CommonActions.goBack())} />
            </View>}
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