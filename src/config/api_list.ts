import { BASE_URL } from "./config"

export const ADDRESSES = {
    LOGIN: `${BASE_URL}/login_app`,
    // UPDATE_LOGIN_FLAG: `${BASE_URL}/api/update_login_status`,
    // RECEIPT_SETTINGS: `${BASE_URL}/api/receipt_settings`,
    GROUP_NAMES: `${BASE_URL}/get_group`,
    GROUP_NAMES_ES: `${BASE_URL}/get_group_add`,
    GET_RELIGIONS: `${BASE_URL}/get_religion`,
    GET_CASTES: `${BASE_URL}/get_caste`,
    GET_EDUCATIONS: `${BASE_URL}/get_education`,
    SAVE_BASIC_DETAILS: `${BASE_URL}/save_basic_dtls`,
    FETCH_CLIENT_DETAILS: `${BASE_URL}/fetch_validation`,
    SAVE_GROUP: `${BASE_URL}/save_group`,

    GET_STATES: `${BASE_URL}/get_state`,
    GET_DISTS: `${BASE_URL}/get_district`,
    GET_BLOCKS: `${BASE_URL}/get_block`,

    FETCH_BASIC_DETAILS: `${BASE_URL}/fetch_basic_dtls`,
    FETCH_PURPOSE_OF_LOAN: `${BASE_URL}/get_purpose`,
    FETCH_SUB_PURPOSE_OF_LOAN: `${BASE_URL}/get_sub_purpose`,
    FETCH_FORMS: `${BASE_URL}/fetch_form_dtls`,
    EDIT_BASIC_DETAILS: `${BASE_URL}/edit_basic_dtls`,
    SAVE_OCCUPATION_DETAILS: `${BASE_URL}/save_occup_dtls`,
    FETCH_OCCUPATION_DETAILS: `${BASE_URL}/fetch_occup_dtls`,

    SAVE_HOUSEHOLD_DETAILS: `${BASE_URL}/save_household_dtls`,
    FETCH_HOUSEHOLD_DETAILS: `${BASE_URL}/fetch_household_dtls`,
    SAVE_FAMILY_DETAILS: `${BASE_URL}/save_family_dtls`,
    FETCH_FAMILY_DETAILS: `${BASE_URL}/fetch_family_dtls`,
    DELETE_FORM: `${BASE_URL}/delete_form`,
    SEARCH_GROUP: `${BASE_URL}/search_group`,
    EDIT_GROUP: `${BASE_URL}/edit_group`,
    MEMBER_DETAILS: `${BASE_URL}/member_dt`,
    SEARCH_MEMBER: `${BASE_URL}/search_member`
}