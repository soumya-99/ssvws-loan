import React, { PropsWithChildren } from "react"
import { ImageProps } from "react-native"
import { Text, IconButton, TouchableRipple } from "react-native-paper"
import { IconSource } from "react-native-paper/lib/typescript/components/Icon"

type ReportButtonProps = {
    text: string
    onPress?: () => void
    icon: IconSource
    color?: string
    textColor?: string
    withImage?: boolean
    imageSource?: string
    imageSourceObject?: ImageProps
}

export default function CollectionButton({
    text,
    icon,
    color,
    textColor,
    withImage,
    imageSource,
    imageSourceObject,
    onPress,
}: PropsWithChildren<ReportButtonProps>) {

    return (
        <TouchableRipple
            onPress={onPress}
            style={{
                width: 102,
                height: 102,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: color,
            }}>
            <>
                <IconButton icon={icon} iconColor={textColor} />
                <Text style={{ textAlign: "center", color: textColor }}>{text}</Text>
            </>
        </TouchableRipple>
    )
}
