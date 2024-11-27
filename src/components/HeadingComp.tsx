import { StyleSheet, View } from 'react-native'
import { IconButton, MD2Colors, Text } from 'react-native-paper'
import React from 'react'
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from '@react-navigation/native'

const HeadingComp = ({
    title,
    subtitle,
    background = "",
    isBackEnabled = false,
    footerText = ""
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
            {footerText && <Text variant="bodySmall" style={{
                color: theme.colors.onPrimary,
                textAlign: "center",
                bottom: -17,
                right: 20,
                left: 160,
                textTransform: "uppercase",
                fontStyle: "italic",
                backgroundColor: MD2Colors.blue500,
                padding: 4,
                width: 200,
                borderRadius: 10,
                fontSize: 11
            }}>{footerText}</Text>}

        </View>
    )
}

export default HeadingComp

const styles = StyleSheet.create({})