import axios from "axios"
import React, { createContext, useEffect, useRef, useState } from "react"
import { AppState, Alert, ToastAndroid } from "react-native"
import { loginStorage } from "../storage/appStorage"
import { ADDRESSES } from "../config/api_list"

export const AppStore = createContext<any>(null)

const AppContext = ({ children }) => {
    const appState = useRef(AppState.currentState)

    const [isLogin, setIsLogin] = useState<boolean>(() => false)

    const handleLogin = async (username: string, password: string) => {
        const creds = {
            emp_id: username,
            password: password
        }

        console.log("LOGIN-----USERNAME-----PASS", creds)

        await axios.post(`${ADDRESSES.CO_LOGIN}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                ToastAndroid.show("Welcome CO!", ToastAndroid.SHORT)
                loginStorage.set("login-data", JSON.stringify(res?.data?.user_dtls))

                setIsLogin(true)
            } else {
                ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                setIsLogin(false)
            }
        }).catch(err => {
            ToastAndroid.show(`Something went wrong while logging in as CO.`, ToastAndroid.SHORT)
        })
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
            handleLogin,
            handleLogout
        }}>
            {children}
        </AppStore.Provider>
    )
}

export default AppContext