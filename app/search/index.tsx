import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Search as SearchIcon, UserPlus, Filter } from 'lucide-react-native';
import { friendUsers } from '@/mocks/user';
import { BackButton } from '@/components/BackButton';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const goals = [
    'weight_loss',
    'muscle_gain',
    'endurance',
    'flexibility',
    'general_fitness',
  ];
  
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };
  
  const filteredUsers = friendUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGoals = selectedGoals.length === 0 || 
      selectedGoals.some(goal => user.fitnessGoals.includes(goal as any));
    
    return matchesSearch && matchesGoals;
  });
  
  const renderItem = ({ item }: { item: typeof friendUsers[0] }) => (
    <Pressable 
      style={styles.userItem}
      onPress={() => router.push(`/profile/${item.id}`)}
    >
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        {item.location && (
          <Text style={styles.userLocation}>{item.location}</Text>
        )}
        
        <View style={styles.goalsContainer}>
          {item.fitnessGoals.slice(0, 2).map((goal, index) => (
            <View key={index} style={styles.goalBadge}>
              <Text style={styles.goalText}>
                {goal.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
            </View>
          ))}
          {item.fitnessGoals.length > 2 && (
            <View style={styles.goalBadge}>
              <Text style={styles.goalText}>+{item.fitnessGoals.length - 2}</Text>
            </View>
          )}
        </View>
      </View>
      
      <Pressable style={styles.addButton}>
        <UserPlus size={20} color={colors.primary} />
      </Pressable>
    </Pressable>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ 
        title: 'Search',
        headerLeft: () => <BackButton />
      }} />
      
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location"
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable onPress={() => setShowFilters(!showFilters)}>
          <Filter size={20} color={colors.primary} />
        </Pressable>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filter by goals:</Text>
          <View style={styles.goalsGrid}>
            {goals.map((goal) => (
              <Pressable
                key={goal}
                style={[
                  styles.goalFilter,
                  selectedGoals.includes(goal) && styles.goalFilterSelected,
                ]}
                onPress={() => toggleGoal(goal)}
              >
                <Text 
                  style={[
                    styles.goalFilterText,
                    selectedGoals.includes(goal) && styles.goalFilterTextSelected,
                  ]}
                >
                  {goal.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalFilter: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  goalFilterSelected: {
    backgroundColor: colors.primary,
  },
  goalFilterText: {
    fontSize: 14,
    color: colors.text,
  },
  goalFilterTextSelected: {
    color: colors.background,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  addButton: {
    padding: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});