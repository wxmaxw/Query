import { useRef, useState } from "react"; //useRef bir componentın değeri değişse bile yeniden render edilmesini engeller
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { FlatList } from "react-native";
import MaskInput, { Mask, Masks } from "react-native-mask-input";
import { showMessage } from "react-native-flash-message";
import { Ionicons, Entypo } from "@expo/vector-icons";

import Button from "./Button";

import sizes from "../constants/sizes";
import colors from "../constants/colors";
import { queryClient, sendRequest } from "../util/http";
import BottomSheetModal from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal";

export default function Input(props) {
  const bottomSheetModalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const sendCodeMutation = useMutation({
    mutationFn: () => {
      const token = queryClient.getQueryData(["token"]);
      return sendRequest({
        api: props.sendCodeApi,
        data: props.sendCodeApiData,
        token,
      });
    },
    onSuccess: (response) => {
      showMessage({ message: response.message, type: "success" });
    },
  });

  const selectItemOnPress = (value) => {
    props.onSelect(value);
    bottomSheetModalRef.current?.dismiss();
    //Optional chaining (?.), JavaScript'te bir özellikin veya metodun mevcut olup olmadığını kontrol eder ve yalnızca mevcutsa çağrılmasını sağlar.
    //Bu, bir referansın mevcut olup olmadığını kontrol ederken kullanışlıdır ve null veya undefined referanslarla karşılaşma riskini azaltır.
  };

  let input = (
    <TextInput
      readOnly={props.disabled}
      secureTextEntry={props.password && !showPassword}
      placeholderTextColor="#ccc"
      {...props}
      style={[
        styles.input,
        props.style,
        props.password && { paddingRight: 46 },
        props.icon && { paddingLeft: 36 },
      ]}
    />
  );

  if (props.phone)
    input = (
      <MaskInput
        style={styles.input}
        mask={Masks.USA_PHONE}
        maxLength={14}
        placeholder=""
        {...props}
      />
    );
  if (props.select) {
    let selectedOptionLabel;
    if (typeof props.options[0] === "object") {
      const selectedOption = props.options.find(
        (item) => item[props.optionValue] === props.value
      );
      selectedOptionLabel = selectedOption && selectedOption[props.optionLabel];
    }
    input = (
      <>
        <Pressable
          style={styles.selectInputContainer}
          onPress={() =>
            !props.disabled && bottomSheetModalRef.current?.present()
          }
        >
          <TextInput
            style={styles.input}
            value={selectedOptionLabel || props.value}
            readOnly
          />
          <Entypo
            style={styles.selectInputChevronDown}
            name="chevron-down"
            size={24}
            color={colors.title500}
          />
        </Pressable>
        <BottomSheetModal>
          <View style={styles.BottomSheetInnerWrapper}>
            <Text style={styles.selectTitle}>{props.label}</Text>
            <FlatList
              data={props.options}
              keyExtractor={(_, index) => index}
              renderItem={({ item }) => {
                const label =
                  typeof item === "string" ? item : item[props.optionLabel];
                const value =
                  typeof item === "string" ? item : item[props.optionValue];
                return (
                  <Pressable
                    style={styles.selectItem}
                    onPress={() => selectItemOnPress(value)}
                  >
                    <Text style={styles.selectItemText}>{label}</Text>
                  </Pressable>
                );
              }}
              contentContainerStyle={styles.bottomSheetContentContainer}
            />
          </View>
        </BottomSheetModal>
      </>
    );
  }

  const passwordTextContainerContent = (
    <Button
      textStyle={[styles.label, styles.forgotPasswordText]}
      mode="text"
      onPress={props.onForgotPasswordPress}
    >
      Şifrenizi mi unuttunuz?
    </Button>
  );

  const passwordInputContainerContent = (
    <Pressable onPress={toggleShowPassword} style={styles.showPasswordButton}>
      <Ionicons
        name={`eye${showPassword ? "-off" : ""}-outline`}
        size={sizes.titleLarge}
        color="#788089"
      />
    </Pressable>
  );

  const sendCodeContainerContent = (
    <Button
      textStyle={[styles.label, styles.forgotPasswordText]}
      mode="text"
      onPress={sendCodeMutation.mutate}
    >
      Kod Gönder
    </Button>
  );

  return (
    <View style={styles.container}>
      {(props.label ||
        props.sendCodeApi ||
        (props.password && props.login)) && (
        <View style={styles.textContainer}>
          {props.password && props.login && passwordTextContainerContent}
          {props.sendCodeApi && sendCodeContainerContent}
        </View>
      )}
      <View style={styles.inputContainer}>
        {props.password && passwordInputContainerContent}
        {input}
        <View style={styles.iconContainer}>{props.icon}</View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginVertical: 8,
        gap: 8,
    },
    label: {
        color: colors.title500,
        fontFamily: "exo",
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        ...colors.shadow,
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    forgotPasswordText: {
        fontSize: sizes.textSmall,
    },
    inputContainer: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
    },
    showPasswordButton: {
        marginHorizontal: 16,
        backgroundColor: "white",
        position: "absolute",
        right: 0,
        zIndex: 1,
    },
    bottomSheetInnerWrapper: {
        paddingHorizontal: 20,
        gap: 10,
    },
    selectInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    selectInputChevronDown: {
        position: "absolute",
        right: 8,
    },
    selectTitle: {
        fontFamily: "exo-bold",
        color: colors.title500,
        fontSize: sizes.titleXXLarge,
    },
    selectItem: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        ...colors.shadow,
    },
    selectItemText: {
        fontFamily: "exo",
    },
    flatListContentContainerStyle: {
        gap: 8,
        paddingVertical: 10,
    },
    iconContainer: {
        position: "absolute",
        left: 8,
    },
});
