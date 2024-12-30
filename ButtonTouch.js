import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";

const ButtonTouch = (props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: props.backColor },
        props.type === "print" && { paddingHorizontal: 100 },
        props.disabled && { backgroundColor: "gray" },
      ]}
      onPress={() => {
        if (props.type === "print" && props.disabled) {
          Alert.alert("Error", "No connected printer device.");
        }
        if (props.type === "search" && props.disabled) {
          Alert.alert("Error", "Bluetooth not enabled/not initialized.");
        } else {
          props.onPress();
        }
      }}
    >
      <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "green",
    borderRadius: 10,
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ButtonTouch;
