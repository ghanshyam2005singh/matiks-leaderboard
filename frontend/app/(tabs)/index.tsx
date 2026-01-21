import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import { getLeaderboard, seedDatabase, User } from '@/services/api';

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLeaderboard();
  }, [page]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard(page);
      setUsers(data.users || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      if (users.length === 0) {
        Alert.alert(
          'No Data', 
          'Click "Seed Database" to generate 10,000 test users'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const handleSeedDatabase = async () => {
    try {
      setLoading(true);
      await seedDatabase();
      Alert.alert('Success', 'Database seeded with 10,000 users!');
      await loadLeaderboard();
    } catch (error) {
      Alert.alert('Error', 'Failed to seed database. Check if backend is running.');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.rating}>Rating: {item.rating}</Text>
      </View>
    </View>
  );

  if (loading && users.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {users.length === 0 && (
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.seedButton}
            onPress={handleSeedDatabase}
          >
            <Text style={styles.buttonText}>🎲 Seed Database</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No users yet</Text>
            <Text style={styles.emptySubtext}>
              Seed the database to get started
            </Text>
          </View>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity 
            style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
            onPress={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
          >
            <Text style={styles.pageButtonText}>← Previous</Text>
          </TouchableOpacity>
          
          <Text style={styles.pageInfo}>
            Page {page} of {totalPages}
          </Text>
          
          <TouchableOpacity 
            style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
            onPress={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
          >
            <Text style={styles.pageButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  header: {
    padding: 15,
  },
  seedButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    padding: 15,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rankBadge: {
    backgroundColor: '#2563eb',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#64748b',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  pageButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#cbd5e1',
    opacity: 0.6,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pageInfo: {
    color: '#1e293b',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});