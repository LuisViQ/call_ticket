import { StyleSheet } from "react-native";

// Estilos da tela de novo chamado.
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
    fontFamily: "InclusiveSans-Regular",
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
    fontFamily: "Inter-Medium",
  },

  input: {
    height: 150,
    paddingHorizontal: 10,
    fontSize: 12,
    textAlignVertical: "top",
    color: "#000",
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 6,
    fontFamily: "Inter-Medium",
  },
  inputSingleLine: {
    height: 44,
    textAlignVertical: "center",
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
  secondaryButton: {
    height: 40,
    borderRadius: 6,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  imageActions: {
    flexDirection: "row",
    gap: 10,
  },
  imageActionButton: {
    flex: 1,
  },
  secondaryButtonText: {
    fontSize: 12,
    color: "#111827",
  },
  imagePreview: {
    marginTop: 8,
    width: "100%",
    height: 180,
    borderRadius: 6,
    backgroundColor: "#F6F6F6",
  },

  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "InclusiveSans-Regular",
  },
  errorArea: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 6,
    textAlign: "left",
  },
  errorIcon: {
    color: "#b91c1c",
  },
});
