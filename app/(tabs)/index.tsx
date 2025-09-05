import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://borderbar-pool.replit.app";

// --- Type Definitions ---
type Player = {
    id: string;
    name: string | null;
};

type SinglesStats = {
    player: Player;
    wins: number;
    losses: number;
    points: number;
};

type DoublesStats = {
    player1: Player;
    player2: Player;
    wins: number;
    losses: number;
    points: number;
};

type Match = {
    type: 'singles' | 'doubles';
};

// --- Reusable Components ---

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

function LeaderboardCard({ rank, name, wins, losses, points }: any) {
    const rankColor = rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32';
    return (
        <View style={styles.playerCard}>
            <View style={[styles.rankContainer, { borderColor: rankColor }]}>
                <Text style={[styles.rank, { color: rankColor }]}>{rank}</Text>
            </View>
            <View style={styles.playerInfoContainer}>
                <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                <Text style={styles.playerStats}>Wins: {wins} | Losses: {losses}</Text>
            </View>
            <View style={styles.pointsContainer}>
                 <Text style={styles.points}>{points}</Text>
                 <Text style={styles.pointsLabel}>Points</Text>
            </View>
        </View>
    );
}


// --- Main Page Component ---

const Page = () => {
    const [stats, setStats] = useState<any[] | null>(null);
    const [topSingles, setTopSingles] = useState<SinglesStats[] | null>(null);
    const [topDoubles, setTopDoubles] = useState<DoublesStats[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [playersResponse, matchesResponse, singlesStatsResponse, doublesStatsResponse] = await Promise.all([
                    fetch(`${API_URL}/api/players`),
                    fetch(`${API_URL}/api/matches`),
                    fetch(`${API_URL}/api/stats/singles`),
                    fetch(`${API_URL}/api/stats/doubles`)
                ]);

                const playersData = await playersResponse.json();
                const matchesData: Match[] = await matchesResponse.json();
                const singlesStatsData = await singlesStatsResponse.json();
                const doublesStatsData = await doublesStatsResponse.json();

                const totalPlayers = playersData.length;
                const totalMatches = matchesData.length;
                const singlesMatches = matchesData.filter(match => match.type === 'singles').length;
                const doublesMatches = matchesData.filter(match => match.type === 'doubles').length;

                setStats([
                    { label: "Total Players", value: totalPlayers, icon: <FontAwesome5 name="users" size={24} color="#2563eb" />, bg: "#e0e7ff" },
                    { label: "Total Matches", value: totalMatches, icon: <MaterialCommunityIcons name="tennis" size={24} color="#059669" />, bg: "#d1fae5" },
                    { label: "Singles", value: singlesMatches, icon: <FontAwesome5 name="user" size={24} color="#2563eb" />, bg: "#e0e7ff" },
                    { label: "Doubles", value: doublesMatches, icon: <MaterialCommunityIcons name="handshake" size={24} color="#a21caf" />, bg: "#f3e8ff" },
                ]);

                setTopSingles(singlesStatsData.slice(0, 3));
                setTopDoubles(doublesStatsData.slice(0, 3));

            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    if (!stats) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#2563eb" />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.grid}>
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </View>

                <View style={styles.leaderboardContainer}>
                    <Text style={styles.leaderboardTitle}>Top 3 Players (Singles)</Text>
                    {topSingles?.map((playerStats, index) => (
                        <LeaderboardCard 
                            key={playerStats.player.id} 
                            rank={index + 1}
                            name={playerStats.player.name}
                            wins={playerStats.wins}
                            losses={playerStats.losses}
                            points={playerStats.points}
                        />
                    ))}
                </View>

                <View style={styles.leaderboardContainer}>
                    <Text style={styles.leaderboardTitle}>Top 3 Doubles Teams</Text>
                    {topDoubles?.map((pairStats, index) => {
                        const player1Name = pairStats.player1?.name || 'N/A';
                        const player2Name = pairStats.player2?.name || 'N/A';
                        const pairId = [pairStats.player1?.id, pairStats.player2?.id].sort().join('-');
                        return (
                            <LeaderboardCard
                                key={pairId}
                                rank={index + 1}
                                name={`${player1Name} & ${player2Name}`}
                                wins={pairStats.wins}
                                losses={pairStats.losses}
                                points={pairStats.points}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
        paddingHorizontal: 16,
        paddingTop: 16
    },
    card: {
        flexBasis: '48%',
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
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
    leaderboardContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    leaderboardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#111827'
    },
    playerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    rankContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    rank: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    playerInfoContainer: {
        flex: 1,
        marginLeft: 16,
    },
    playerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    playerStats: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    pointsContainer: {
        alignItems: 'center',
        paddingLeft: 12,
        borderLeftWidth: 1,
        borderLeftColor: '#f3f4f6',
    },
    points: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    pointsLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    }
});