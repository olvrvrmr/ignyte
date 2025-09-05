import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockStats = [
    {
        label: "Total Players",
        value: 12,
        icon: <FontAwesome5 name="users" size={24} color="#2563eb" />,
        bg: "#e0e7ff",
    },
    {
        label: "Total Matches",
        value: 135,
        icon: <MaterialCommunityIcons name="tennis" size={24} color="#059669" />,
        bg: "#d1fae5",
    },
    {
        label: "Singles Matches",
        value: 90,
        icon: <FontAwesome5 name="user" size={24} color="#2563eb" />,
        bg: "#e0e7ff",
    },
    {
        label: "Doubles Matches",
        value: 45,
        icon: <MaterialCommunityIcons name="handshake" size={24} color="#a21caf" />,
        bg: "#f3e8ff",
    },
];

function StatCard({ label, value, icon, bg }: any) {
    return (
        <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: bg }]}>{icon}</View>
            <View style={{ marginLeft: 12 }}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

const Page = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
      <View style={styles.grid}>
        {mockStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </View>
    </SafeAreaView>
    )
}

export default Page

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        gap: 12,
    },
    card: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 18,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        minWidth: 160,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: 15,
        color: "#374151",
        fontWeight: "500",
    },
    value: {
        fontSize: 22,
        color: "#111827",
        fontWeight: "bold",
        marginTop: 2,
    },
});