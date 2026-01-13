import { StyleSheet } from "react-native";

// Estilos da tela inicial.
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5e504f",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcome: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#fff",
  },
  userName: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "#fff",
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoutText: {
    fontFamily: "Inter-Bold",
    fontSize: 13,
    color: "#fff",
    marginLeft: 6,
  },
  logoutIcon: {
    color: "#fff",
  },
  errorArea: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
  },
  errorText: {
    color: "#fecaca",
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 6,
    textAlign: "left",
  },
  errorIcon: {
    color: "#fecaca",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  listHeader: {
    marginBottom: 8,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: "#cec1bd",
  },
  primaryButtonEnabled: {
    backgroundColor: "#5d5350",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter-Bold",
  },
  primaryButtonIcon: {
    color: "#fff",
    marginRight: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#111827",
  },
  sectionAction: {
    fontSize: 12,
    color: "#6b7280",
  },
  cardSeparator: {
    height: 12,
  },
  ticketCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: "#111827",
  },
  statusPill: {
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 11,
    color: "#374151",
  },
  statusPillWaiting: {
    backgroundColor: "#fef3c7",
  },
  statusTextWaiting: {
    color: "#92400e",
  },
  statusPillInProgress: {
    backgroundColor: "#dbeafe",
  },
  statusTextInProgress: {
    color: "#1e40af",
  },
  statusPillCanceled: {
    backgroundColor: "#fee2e2",
  },
  statusTextCanceled: {
    color: "#991b1b",
  },
  statusPillClosed: {
    backgroundColor: "#dcfce7",
  },
  statusTextClosed: {
    color: "#166534",
  },
  ticketDescription: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
  },
  ticketMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#9ca3af",
  },
  stateText: {
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 24,
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
