import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

interface PickerItem {
  label: string;
  value: string;
}

interface StyledPickerProps {
  label?: string;
  placeholder?: string;
  items: PickerItem[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const StyledPicker: React.FC<StyledPickerProps> = ({
  label,
  placeholder = "Select an option",
  items,
  selectedValue,
  onValueChange,
  error,
  disabled = false,
}) => {
  const theme = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsModalVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 8,
    },
    picker: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    pickerText: {
      fontSize: 16,
      color: selectedItem ? theme.colors.text : theme.colors.placeholder,
      flex: 1,
    },
    icon: {
      marginLeft: 8,
    },
    error: {
      fontSize: 14,
      color: theme.colors.error,
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      margin: 20,
      maxHeight: "50%",
      minWidth: "80%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    optionItem: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary,
    },
    selectedOptionText: {
      color: theme.colors.background,
      fontWeight: "600",
    },
    cancelButton: {
      padding: 20,
      alignItems: "center",
    },
    cancelButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
  });

  const renderOption = ({ item }: { item: PickerItem }) => {
    const isSelected = item.value === selectedValue;

    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.selectedOption]}
        onPress={() => handleSelect(item.value)}
      >
        <Text
          style={[styles.optionText, isSelected && styles.selectedOptionText]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.picker}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
      >
        <Text style={styles.pickerText}>{displayText}</Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={theme.colors.textSecondary}
          style={styles.icon}
        />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Select Option"}</Text>
            </View>

            <FlatList
              data={items}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
            //contentContainerStyle={{padding: 10}}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default StyledPicker;
