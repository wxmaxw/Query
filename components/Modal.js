import {StyleSheet, View, Text, Pressable, Modal} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from "../constants/colors";

export default function CustomModal({children, isVisible, style, onClose = () => {}}) {
    return(
        <Modal animationType='slide' transparent visible={isVisible} onRequestClose={onClose}>
            <View style={StyleSheet.centeredView}>
                <View style={[styles.modalView, style]}>
                    {children}
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name='close' size={24} color="#475288"/>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 18,
        padding: 24,
        borderWidth: 1,
        borderColor: "#0001",
        ...colors.shadow,
    },
    closeButton: {
        position: "absolute",
        top: 8,
        right: 8,
    },
});