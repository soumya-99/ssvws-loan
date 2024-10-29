import { loginStorage } from '../storage/appStorage'

interface DisableConditonProps {
    approvalStatus: string
    branchCode: string
}

const disableCondition = (approvalStatus, branchCode) => {
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    if (approvalStatus !== "U" || +branchCode !== +loginStore?.brn_code) {
        return true
    }

    return false
}

const disableConditionExceptBasicDetails = (approvalStatus, branchCode, flag = "CO") => {
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    if (flag === "CO" || approvalStatus !== "U" || +branchCode !== +loginStore?.brn_code) {
        return true
    }

    return false
}

export { disableCondition, disableConditionExceptBasicDetails }
