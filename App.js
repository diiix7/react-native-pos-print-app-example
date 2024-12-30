import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { BLEPrinter } from "@diiix7/react-native-pos-print";
import ButtonTouch from "./ButtonTouch";

export default function App() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [bluetoothInitialized, setBluetoothInitialized] = useState(false);
  const [searching, setSearching] = useState(false);

  const activityIndicator = () => {
    return (
      <ActivityIndicator
        size={"large"}
        color="green"
        style={styles.indicator}
      />
    );
  };

  const initializePrinter = async () => {
    try {
      await BLEPrinter.init();
      setBluetoothInitialized(true);
      Alert.alert("Bluetooth initialized", "You can now search for devices.");
    } catch (error) {
      console.error("Error initializing printer:", error);
      Alert.alert(
        "Error",
        "Failed to initialize Bluetooth, activate bluetooth on your device to continue."
      );
    }
  };

  const searchDevices = async () => {
    setSearching(true);
    try {
      const deviceList = await BLEPrinter.getDeviceList();
      if (deviceList.length === 0) {
        Alert.alert(
          "No devices found",
          "Please ensure your printer is on and discoverable."
        );
      } else {
        setDevices(deviceList);
        setSearching(false);
      }
    } catch (error) {
      setSearching(false);
      console.error("Error fetching devices:", error);
      Alert.alert("Error", "Failed to fetch device list.");
    }
  };

  const connectToDevice = async (macAddress) => {
    try {
      await BLEPrinter.connectPrinter(macAddress);
      setConnectedDevice(macAddress);
      Alert.alert("Connected", `Printer connected to: ${macAddress}`);
    } catch (error) {
      console.error("Error connecting to printer:", error);
      Alert.alert("Error", "Failed to connect to printer.");
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  const printTemplate = `
    <Printout>
      <Text align='center' fontWidth='1' fontHeight='2' marginTop='-1' bold='1'>Welcome to My\nShop</Text>
      <NewLine />
      <NewLine />
      <Text align='center' fontWidth='0.5' fontHeight='1'>Receipt #12345\nDate: ${getCurrentDateTime()}</Text>
      <NewLine />
      <NewLine />
      <Text align='left' fontWidth='0.5' fontHeight='1' bold='1'>Item              Qty   Price</Text>
      <NewLine />
      <Text align='left' fontWidth='0.5' fontHeight='1'>Apple             2     $3.00\n</Text>
      <NewLine />
      <Text align='left' fontWidth='0.5' fontHeight='1'>Orange            1     $1.50\n</Text>
      <NewLine />
      <Text align='left' fontWidth='0.5' fontHeight='1'>Banana            3     $2.25\n</Text>
      <NewLine />
      <NewLine />
      <Text align='right' fontWidth='0.5' fontHeight='1' bold='1'>Total:          $6.75</Text>
      <NewLine />
      <NewLine />
      <Text align='center' fontWidth='0.5' fontHeight='1' bold='0'>Thank you for shopping\nwith us!</Text>
      <NewLine />
      <NewLine />
      <NewLine />
      <NewLine />
      <NewLine />
      <Cut />
    </Printout>
  `;

  const printOptions = {
    beep: true,
    cut: true,
    tailingLine: true,
    encoding: "UTF-8",
    codepage: 0,
  };

  const printExample = async () => {
    if (!connectedDevice) {
      Alert.alert("No printer connected", "Please connect to a printer first.");
      return;
    }
    try {
      await BLEPrinter.print(printTemplate, printOptions);

      Alert.alert("Print Status", "Printed successfully complete.");
    } catch (error) {
      console.error("Error printing:", error);
      Alert.alert("Print Status", "Failed to print.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Printer Example</Text>
      <ButtonTouch
        title="Initialize Bluetooth"
        backColor={"green"}
        onPress={initializePrinter}
      />
      <ButtonTouch
        title="Search for Devices"
        backColor={"green"}
        disabled={!bluetoothInitialized}
        onPress={searchDevices}
        type={"search"}
      />
      {searching ? (
        activityIndicator()
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.innerMacAddress}
          renderItem={({ item }) =>
            item.deviceName && item.deviceName !== "null" ? (
              <ButtonTouch
                title={`Connect to ${item.deviceName}`}
                backColor={"skyblue"}
                onPress={() => connectToDevice(item.innerMacAddress)}
              />
            ) : null
          }
        />
      )}
      <ButtonTouch
        title="Print"
        backColor={"green"}
        disabled={!connectedDevice}
        onPress={printExample}
        type={"print"}
      />

      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  indicator: {
    marginVertical: "38%",
  },
});
