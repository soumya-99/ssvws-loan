import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import ItemList from './ItemList';
import SamplePrint from './SamplePrint';
// import HeaderImage from '../../components/HeaderImage';
// import {flowerSetting, flowerSettingDark} from '../../resources/images';
import {usePaperColorScheme} from '../../theme/theme';
import ButtonPaper from '../../components/ButtonPaper';
import HeadingComp from '../../components/HeadingComp';

const PrintMain = () => {
  const theme = usePaperColorScheme();

  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');

  useEffect(() => {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth is turned on!');
      })
      .catch(err => {
        ToastAndroid.show(`${err}`, ToastAndroid.SHORT);
      });

    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp);
        },
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp);
        },
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName('');
          setBoundAddress('');
        },
      );
    } else if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName('');
          setBoundAddress('');
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
        () => {
          ToastAndroid.show(
            'Device Not Support Bluetooth !',
            ToastAndroid.LONG,
          );
        },
      );
    }

    console.log(pairedDevices.length);
    if (pairedDevices.length < 1) {
      scan();
      console.log('scanning...');
    } else {
      const firstDevice = pairedDevices[0];
      console.log('length  :' + pairedDevices.length);
      console.log(firstDevice);
      connect(firstDevice);

      // connect(firstDevice);
      // console.log(pairedDevices.length + "hello");
    }
  }, [pairedDevices]);
  // deviceFoundEvent,pairedDevices,scan,boundAddress
  // boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );
  // const deviceAlreadPaired = useCallback(
  //   async rsp => {
  //     try {
  //       var ds = null;
  //       if (typeof rsp.devices === 'object') {
  //         ds = rsp.devices;
  //       } else {
  //         try {
  //           ds = JSON.parse(rsp.devices);
  //         } catch (e) {}
  //       }
  //       if (ds && ds.length) {
  //         let pared = pairedDevices;
  //         if (pared.length < 1) {
  //           pared = pared.concat(ds || []);
  //         }
  //         setPairedDevices(pared);
  //       }
  //     } catch (error) {
  //       // Handle any errors that occurred during the asynchronous operations
  //       console.error(error);
  //     }
  //   },
  //   [pairedDevices],
  // );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  // const connect = (row) => {
  //   setLoading(true);
  //   BluetoothManager.connect(row.address).then(
  //     (s) => {
  //       setLoading(false);
  //       setBoundAddress(row.address);
  //       setName(row.name || "UNKNOWN");
  //       console.log("Connected to device:", row.name);
  //     },
  //     (e) => {
  //       setLoading(false);
  //       alert(e);
  //     }
  //   );
  // };

  const connect = async row => {
    try {
      setLoading(true);
      await BluetoothManager.connect(row.address);
      setLoading(false);
      setBoundAddress(row.address);
      setName(row.name || 'UNKNOWN');
      console.log('Connected to device:', row);
    } catch (e) {
      setLoading(false);
      // alert(e)
    }
  };

  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        // alert(e);
      },
    );
  };

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'Bluetooth Permission Needed.',
          message:
            'Go to Permissions -> Allow Location, Nearby devices, Location access.',
          buttonNeutral: 'Later',
          buttonNegative: 'No',
          buttonPositive: 'Yes',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
          Alert.alert(
            'Allow Permissions',
            'Click Open Settings: Go to Permissions -> Allow Location, Nearby devices, Notifications access.',
            [
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
              {text: 'Later', onPress: () => null},
            ],
          );
        }
      }

      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert(
          'Allow Permissions',
          'Click Open Settings: Go to Permissions -> Allow Location, Nearby devices, Notifications access.',
          [
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
            {text: 'Later', onPress: () => null},
          ],
        );
      }
    } catch (err) {
      setLoading(false);
      Alert.alert(
        'Allow Permissions',
        'Click Open Settings: Go to Permissions -> Allow Location, Nearby devices, Notifications access.',
        [
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
          {text: 'Later', onPress: () => null},
        ],
      );
    }
  };

  return (
    <>
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View>
          <HeadingComp
            title="Printer Connect"
            subtitle="Connect your printer here..."
            isBackEnabled
          />
        </View>
        <ScrollView
          style={{
            paddingHorizontal: 20,
          }}>
          <View style={styles.bluetoothStatusContainer}>
            <Text
              style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
              Bluetooth {bleOpend ? 'Active' : 'Not Active'}
            </Text>
          </View>
          {!bleOpend && (
            <Text
              style={[
                styles.bluetoothInfo,
                {color: theme.colors.onBackground},
              ]}>
              Please activate your bluetooth
            </Text>
          )}
          <Text
            style={[styles.sectionTitle, {color: theme.colors.onBackground}]}>
            Printer connected to the application:
          </Text>
          {boundAddress.length > 0 && (
            <ItemList
              label={name}
              value={boundAddress}
              onPress={() => {
                // console.log("disconnect false")
                unPair(boundAddress);
              }}
              actionText="Unpair"
              color={theme.colors.primary}
            />
          )}
          {boundAddress.length < 1 && (
            <Text
              style={[styles.printerInfo, {color: theme.colors.onBackground}]}>
              There is no printer connected yet
            </Text>
          )}
          <Text
            style={[styles.sectionTitle, {color: theme.colors.onBackground}]}>
            Bluetooth connected to this phone:
          </Text>
          <Text style={[styles.sectionSub, {color: theme.colors.onBackground}]}>
            (If not, pair it from your bluetooth)
          </Text>
          {loading ? <ActivityIndicator animating={true} /> : null}
          <View style={styles.containerList}>
            {pairedDevices.map((item, index) => {
              return (
                <ItemList
                  key={index}
                  onPress={() => connect(item)}
                  label={item.name}
                  value={item.address}
                  connected={item.address === boundAddress}
                  actionText="Connect"
                  color="#00BCD4"
                />
              );
            })}
          </View>
          <SamplePrint />
          <ButtonPaper onPress={() => scanBluetoothDevice()} mode="contained">
            Scan / Connect
          </ButtonPaper>
          {/* <Button onPress={() => scanBluetoothDevice()} title="Scan / Connect" /> */}
          <View style={{height: 100}} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default PrintMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    // paddingHorizontal: 20,
  },
  containerList: {flex: 1, flexDirection: 'column'},
  bluetoothStatusContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  bluetoothStatus: color => ({
    backgroundColor: color,
    padding: 8,
    borderRadius: 2,
    color: 'white',
    paddingHorizontal: 14,
    marginBottom: 20,
  }),
  bluetoothInfo: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {fontWeight: 'bold', fontSize: 18, marginBottom: 12},
  printerInfo: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  sectionSub: {fontSize: 15, marginBottom: 5},
});
