import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { User } from "@/types/user";
import { Users } from "lucide-react-native";

interface FriendsListProps {
  friends: User[];
}

export function FriendsList({ friends }: FriendsListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <View style={styles.countBadge}>
          <Users size={14} color={colors.primary} />
          <Text style={styles.countText}>{friends.length}</Text>
        </View>
      </View>
      
      <View style={styles.friendsList}>
        {friends.map((friend) => (
          <Pressable key={friend.id} style={styles.friendItem}>
            <Image 
              source={{ uri: friend.avatarUrl }} 
              style={styles.avatar}
            />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendBio} numberOfLines={1}>
                {friend.bio}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  friendsList: {
    gap: 16,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  friendBio: {
    fontSize: 14,
    color: colors.textLight,
  },
});