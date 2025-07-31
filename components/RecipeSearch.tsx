import { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRecipeStore } from '@/hooks/use-recipe-store';

export function RecipeSearch() {
  const { searchQuery, setSearchQuery } = useRecipeStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
        <Search size={20} color={colors.textLight} />
        <TextInput
          style={styles.input}
          placeholder="Search recipes..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={8}>
            <X size={20} color={colors.textLight} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: colors.primary + '50',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    paddingVertical: 0,
  },
});