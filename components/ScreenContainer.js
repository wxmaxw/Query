import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";

import sizes from '../constants/sizes';
import colors from '../constants/colors';

export default function ScreenContainer(props){
    return(
        <View style={[styles.container, props.style]}>
            {props.isLoading && <ActivityIndicator/>}
            {!props.isLoading && (
                <ScrollView 
                showsVerticalScrollIndicator={false}
                {...props}
                contentContainerStyle={[styles.scrollView, props.contentContainerStyle]}
                >
                    {props.children}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgSecondary,
        paddingHorizontal: sizes.screenPaddingHorizontal,
        paddingTop: sizes.screenPaddingVertical,
    },
    scrollView: {
        flexGrow: 1,
        paddingBottom: 96,
    },
});
