import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Alert
} from 'react-native';
import { searchUsers, User } from '@/services/api';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a username to search');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setSearched(true);

    try {
      const data = await searchUsers(searchQuery);
      setResults(data || []);
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert('Error', 'Search failed. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.resultCard}>
      <View style={styles.rankSection}>
        <Text style={styles.rankLabel}>Global Rank</Text>
        <Text style={styles.rankNumber}>#{item.rank}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.userSection}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.rating}>Rating: {item.rating}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter username (e.g., rahul)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {!loading && searched && (
        <View style={styles.resultsContainer}>
          {results.length > 0 ? (
            <>
              <Text style={styles.resultsCount}>
                Found {results.length} user{results.length !== 1 ? 's' : ''}
              </Text>
              <FlatList
                data={results}
                renderItem={renderUser}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No users found</Text>
              <Text style={styles.emptySubtext}>
                Try searching for "rahul", "priya", or other names
              </Text>
            </View>
          )}
        </View>
      )}

      {!loading && !searched && (
        <View style={styles.initialState}>
          <Text style={styles.initialIcon}>🔎</Text>
          <Text style={styles.initialText}>Search for users</Text>
          <Text style={styles.initialSubtext}>
            Enter a username to find their global rank
          </Text>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    padding: 15,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  list: {
    padding: 15,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rankSection: {
    alignItems: 'center',
    marginRight: 15,
  },
  rankLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  rankNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  divider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 10,
  },
  userSection: {
    flex: 1,
    justifyContent: 'center',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  initialIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  initialText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  initialSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});