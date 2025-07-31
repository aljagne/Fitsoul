import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Dumbbell, UtensilsCrossed, Trophy, Users } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ActionType = {
  id: string;
  title: string;
  icon: string;
};

type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  actions: ActionType[];
  onSelect: (action: string) => void;
};

export function ActionSheet({ visible, onClose, actions, onSelect }: ActionSheetProps) {
  const insets = useSafeAreaInsets();
  
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Dumbbell':
        return <Dumbbell size={24} color={colors.primary} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed size={24} color={colors.primary} />;
      case 'Trophy':
        return <Trophy size={24} color={colors.primary} />;
      case 'Users':
        return <Users size={24} color={colors.primary} />;
      default:
        return <Dumbbell size={24} color={colors.primary} />;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Pressable 
          style={styles.backdrop} 
          onPress={onClose}
        />
        <View style={[styles.modalView, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Quick Actions</Text>
          
          <View style={styles.actionsContainer}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={() => {
                  onSelect(action.id);
                }}
              >
                <View style={styles.iconContainer}>
                  {getIcon(action.icon)}
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  actionsContainer: {
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: colors.cardDark,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
  },
});