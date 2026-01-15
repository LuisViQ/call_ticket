import { StyleSheet } from "react-native";

// Estilos da tela de detalhe do chamado.
export const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: 6,
  },
  value: {
    fontSize: 16,
    color: "#111827",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },
  imageFallback: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  imageFallbackText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },
});
