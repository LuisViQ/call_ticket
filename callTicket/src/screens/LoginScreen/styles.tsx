import { StyleSheet } from "react-native";

// Estilos da tela de login.
export const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 48,
  },
  card: {
    width: "100%",
    maxWidth: 420,
  },
  title: {
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 24,
    textAlign: "center",
  },
  titleLight: {
    color: "#9ca3af",
  },
  titleDark: {
    color: "#374151",
  },
  subtitle: {
    fontSize: 20,
    color: "#111827",
    marginBottom: 48,
    textAlign: "left",
  },
  inputWrap: {
    position: "relative",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    marginBottom: 16,
    width: 350,
    height: 56,
    justifyContent: "center",
  },
  leftIcon: {
    position: "absolute",
    left: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingVertical: 16,
    paddingLeft: 48,
    paddingRight: 16,
    color: "#4b5563",
    fontSize: 16,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  rightIconButton: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonArea: {
    paddingTop: 32,
  },
  button: {
    width: "100%",
    backgroundColor: "#5d5350",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorArea: {
    flexDirection: "row",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "left",
  },
  errorIcon: {
    color: "#b91c1c",
  },
});
