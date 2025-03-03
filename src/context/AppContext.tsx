import axios from "axios"
import React, { createContext, useEffect, useRef, useState } from "react"
import { AppState, Alert, ToastAndroid } from "react-native"
import { loginStorage } from "../storage/appStorage"
import { ADDRESSES } from "../config/api_list"
import DeviceInfo from "react-native-device-info"

export const AppStore = createContext<any>(null)

const AppContext = ({ children }) => {
    const appState = useRef(AppState.currentState)
    const appVersion = DeviceInfo.getVersion()
    // debugging
    const uat = true

    const [isLogin, setIsLogin] = useState<boolean>(() => false)
    const [isLoading, setIsLoading] = useState<boolean>(() => false)

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true)
        const creds = {
            emp_id: username,
            password: password,
            // "app_version": appVersion,
            // "flag": "A"
        }

        console.log("LOGIN-----USERNAME-----PASS", creds)

        await axios.post(`${ADDRESSES.LOGIN}`, creds).then(res => {
            console.log("LOGIN LOGGGG===", res?.data)
            if (res?.data?.suc === 1) {
                ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                loginStorage.set("login-data", JSON.stringify(res?.data?.user_dtls))

                setIsLogin(true)
            } else {
                ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                setIsLogin(false)
            }
        }).catch(err => {
            console.log(">>>>>", err)
            ToastAndroid.show(`Something went wrong while logging in.`, ToastAndroid.SHORT)
        })
        setIsLoading(false)
    }

    const isLoggedIn = () => {
        if (loginStorage.getAllKeys().length === 0) {
            console.log("IF - isLoggedIn")
            setIsLogin(false)
        } else {
            console.log("ELSE - isLoggedIn")
            setIsLogin(true)
        }
    }

    useEffect(() => {
        if (appState.current === "active") {
            isLoggedIn()
        }
    }, [])



    const handleLogout = async () => {
        loginStorage.clearAll()
        setIsLogin(false)
    }

    return (
        <AppStore.Provider value={{
            isLogin,
            isLoading,
            handleLogin,
            handleLogout,
            uat
        }}>
            {children}
        </AppStore.Provider>
    )
}

export default AppContext