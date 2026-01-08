import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5e504f",
  },

  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "#5e504f",
  },
  header: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  welcome: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#fff",
  },

  userName: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },

  logoutText: {
    position: "absolute",
    top: 23,
    left: 331,
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
    textAlign: "left",
  },

  actionsArea: {
    flex: 1,
    marginTop: 193,
    width: "100%",
  },

  actionsAreaBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#fff",
  },

  actionCard: {
    position: "absolute",
    left: 26,
    width: 320,
    height: 98,
    borderWidth: 1,
    borderColor: "#8b8b8b",
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4, // sombra Android
    paddingLeft: 80,
    justifyContent: "center",
  },

  actionTitle: {
    fontFamily: "Inter-Regular",
    fontSize: 19,
    color: "#000",
    textAlign: "left",
  },
});
