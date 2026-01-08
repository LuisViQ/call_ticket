import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 48,
  },

  header: {
    height: 72,
    justifyContent: "center",
  },

  title: {
    fontSize: 25,
    color: "#000",
    fontFamily: "InclusiveSans-Regular", // se não tiver fonte, remove essa linha
  },

  form: {
    marginTop: 32,
    gap: 14,
  },

  field: {
    gap: 6,
  },

  fieldLabel: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Inter-Medium", // se não tiver fonte, remove
  },

  input: {
    height: 39,
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#000",
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 6,
    fontFamily: "Inter-Medium", // se não tiver fonte, remove
  },

  pickerLabel: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Inter-Medium",
  },

  pickerBox: {
    height: 39,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 6,
    justifyContent: "center",
    overflow: "hidden",
  },

  picker: {
    height: 100,
    color: "#000",
  },

  button: {
    marginTop: 18,
    height: 48,
    borderRadius: 6,
    backgroundColor: "#5E504F",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "InclusiveSans-Regular",
  },
});
