import {
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {
    List,
    Text,
} from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { usePaperColorScheme } from '../../theme/theme';
import HeadingComp from '../../components/HeadingComp';
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { loginStorage } from '../../storage/appStorage';
import ButtonPaper from '../../components/ButtonPaper';
import SurfacePaper from '../../components/SurfacePaper';
import DatePicker from 'react-native-date-picker';
import { formattedDate } from '../../utils/dateFormatter';
import axios from 'axios';
import { ADDRESSES } from '../../config/api_list';

const AttendanceReportScreen = () => {
    const theme = usePaperColorScheme();
    const navigation = useNavigation();
    const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '');

    const [isLoading, setIsLoading] = useState(() => false);
    const [isDisabled, setIsDisabled] = useState(() => false);

    const [fromDate, setFromDate] = useState(() => new Date());
    const [toDate, setToDate] = useState(() => new Date());
    const [openFromDate, setOpenFromDate] = useState(() => false);
    const [openToDate, setOpenToDate] = useState(() => false);

    const formattedFromDate = formattedDate(fromDate);
    const formattedToDate = formattedDate(toDate);

    const [reportData, setReportData] = useState(() => []);

    const titleTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer,
    };

    const titleStyle: ViewStyle = {
        backgroundColor: theme.colors.primaryContainer,
    };

    const fetchReport = async () => {
        setIsLoading(true);
        setIsDisabled(true);
        const creds = {
            from_dt: formattedFromDate,
            to_dt: formattedToDate,
            emp_id: loginStore?.emp_id,
        };
        await axios
            .post(`${ADDRESSES.ATTENDANCE_REPORT}`, creds)
            .then(res => {
                console.log('>>>>>>', res?.data);
                setReportData(res?.data?.msg);
            })
            .catch(err => {
                console.log('<<<<<<', err);
            });
        setIsLoading(false);
        setIsDisabled(false);
    };

    return (
        <SafeAreaView>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{
                    backgroundColor: theme.colors.background,
                }}>
                <HeadingComp
                    title="Attendance Report"
                    subtitle="View your attendance"
                    isBackEnabled
                />
                <View
                    style={{
                        minHeight: SCREEN_HEIGHT,
                        height: 'auto',
                        paddingHorizontal: 20,
                        gap: 10,
                    }}>
                    <View
                        style={{
                            backgroundColor: theme.colors.onSecondary,
                            gap: 10,
                            padding: 10,
                            borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 15,
                                alignItems: 'center',
                                backgroundColor: theme.colors.tertiary,
                                padding: 2,
                                borderRadius: 12,
                            }}>
                            <ButtonPaper
                                textColor={theme.colors.onTertiary}
                                onPress={() => setOpenFromDate(true)}
                                mode="text">
                                FROM: {fromDate?.toLocaleDateString('en-GB')}
                            </ButtonPaper>
                            <ButtonPaper
                                textColor={theme.colors.onTertiary}
                                onPress={() => setOpenToDate(true)}
                                mode="text">
                                TO: {toDate?.toLocaleDateString('en-GB')}
                            </ButtonPaper>

                            <DatePicker
                                modal
                                mode="date"
                                open={openFromDate}
                                date={fromDate}
                                onConfirm={date => {
                                    setOpenFromDate(false);
                                    setFromDate(date);
                                }}
                                onCancel={() => {
                                    setOpenFromDate(false);
                                }}
                            />
                            <DatePicker
                                modal
                                mode="date"
                                open={openToDate}
                                date={toDate}
                                onConfirm={date => {
                                    setOpenToDate(false);
                                    setToDate(date);
                                }}
                                onCancel={() => {
                                    setOpenToDate(false);
                                }}
                            />
                        </View>
                        <View>
                            <ButtonPaper
                                onPress={() => fetchReport()}
                                mode="contained-tonal"
                                buttonColor={theme.colors.secondary}
                                textColor={theme.colors.onSecondary}
                                loading={isLoading}
                                disabled={isDisabled}>
                                SUBMIT
                            </ButtonPaper>
                        </View>
                    </View>

                    <View>
                        <SurfacePaper backgroundColor={theme.colors.surface}>
                            {reportData?.map((item, index) => (
                                <>
                                    <View style={{ backgroundColor: theme.colors.primaryContainer, width: '100%', alignItems: 'center', padding: 10, borderRadius: 10 }}>
                                        <Text>{new Date(item.entry_dt)?.toLocaleDateString("en-GB")}</Text>
                                    </View>
                                    {item.memb_dtls_app?.map((mem, i) => (
                                        <React.Fragment key={i}>
                                            <List.Item

                                                key={i}
                                                title={
                                                    <View>
                                                        <Text style={{ color: theme.colors.green, fontSize: 15 }}>
                                                            Entry Date -{mem?.entry_dt}
                                                        </Text>
                                                        <Text >
                                                            Name -{mem?.client_name}
                                                        </Text>
                                                        <Text>
                                                            Credit -{mem?.credit}/-
                                                        </Text>
                                                        <Text>
                                                            Balance -{mem?.balance}/-
                                                        </Text>

                                                    </View>


                                                }
                                                description={
                                                    <View>
                                                        <Text
                                                        >
                                                            {mem?.member_name}
                                                        </Text>
                                                    </View>
                                                }
                                            />
                                        </React.Fragment>
                                    ))}
                                </>
                            ))}
                            {/* </ScrollView> */}
                            {/* <View style={{padding: normalize(10)}}>
                  <Text
                    variant="labelMedium"
                    style={{color: theme.colors.primary}}>
                   TOTAL CREDIT: {tot_credit?.toFixed(2)}/- //{' '}
                  </Text>
                </View> */}
                        </SurfacePaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AttendanceReportScreen;

const styles = StyleSheet.create({});
