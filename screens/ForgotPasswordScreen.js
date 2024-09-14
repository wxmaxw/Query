import {useState} from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";

import sizes from "../constants/sizes";
import { sendRequest } from "../util/http";
import { showMessage } from "react-native-flash-message";
import colors from "../constants/colors";

export default function ForgotPasswordScreen({isOpen, onClose}) {
    const [mode, setMode] = useState("sendCode");
    const [kimlikNo, setKimlikNo] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const CodeFieldRef = useBlurOnFulfill({value: code, cellCount:5});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({value: code, setValue:setCode});
 
    const onSettled = (response, nextMode) => {
        const is200 = response.status ===200;
        if(is200) setMode(nextMode);
        showMessage({message: response.message, type: is200 ? "success": "info"});
    };

    const sendCodeMutation = useMutation({
        mutationFn: () => sendRequest({ api: "/user/sendCodeForChangePass", data: { kimlikNo } }),
        onSettled: (response) => onSettled(response, "checkCode"),
        onMutate: () => setCode(""),
    });

    const checkCodeMutation = useMutation({
        mutationFn: () => sendRequest({ api: "/user/confirmCodeForChangePass", data: {kimlikNo, code}}),
        onSettled: (response) => onSettled(response, "changePassword"),
    });

    const changePasswordMutation = useMutation({
        mutationFn: () => sendRequest({api: "/user/changePassword", data: {kimlikNo, code}}),
        onSettled: (response) => {
            onSettled(response, "sendCode");
            setKimlikNo("");
            setCode("");
            setPassword("");
            setPasswordRepeat("");
            onClose();
        }, 
    });

    const changePasswordSubmitHandler = () => {
        if(password!== passwordRepeat) return showMessage({message: "Yeni şifre ve tekrarı aynı değil!", type: "info"});
            changePasswordMutation.mutate();
    }

    return(
        <Modal isVisible={isOpen} onClose={onClose}>
            {mode === "sendCode" && (
                <>
                <Text style={styles.title}> Şifre Sıfırlama</Text>
                <Text style={styles.text}>Şifreni sıfırlamak için T.C. kimlik numaranı yaz.</Text>
                <Input style={styles.input} value={kimlikNo} onChangeText = "T.C. Kimlik No" />
                <Button mode = "primary" style={styles.button} isLoading={sendCodeMutation.isPending} onPress={sendCodeMutation.mutate}>
                    Gönder
                </Button>
                </>
            )}
            {mode === "checkCode" && (
                <>
                <Text style={styles.title}>Kod Doğrulama</Text>
                <Text style={styles.text}>Telefonuna gelen doğrulama kodunu gir.</Text>
                <CodeField
                ref ={CodeField}
                {...props}
                value={code}
                onChangeText= {setCode}
                cellCount={5}
                rootStyle={styles.CodeFieldRoot}
                keyboatdType="number-pad"
                textContentType = "oneTimeCode"
                autoComplete= {Platform.select({android: "sms-otp", default: "one-time-code"})}
                renderCell={({index, symbol, isFocused}) => (
                    <Text key={index} style={styles.cell} onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor/> : null)}
                    </Text>
                )}
                />
                <Button mode="primary" style={styles.button} isLoading={checkCodeMutation.isPending} onPress={checkCodeMutation.mutate}>
                    Doğrula
                </Button>  
                <Button
                    mode= "primary"
                    style={[styles.button, {backgroundColo: "#46c99f"}]}
                    isLoading={sendCodeMutation.isPending}
                    onPress = {sendCodeMutation.mutate}
                >
                    Tekrar Gönder
                    </Button>                      
                </>
            )}
            {mode ==="changePassword" && (
                <>
                <Text style={styles.title}>Şifre Değiştirme</Text>
                <Input 
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder = "Yeni Şifre"
                    password
                    icon={<Ionicons name="lock-closed-outline" size={24} color="^c2c3cb" />}    
                />
                <Button
                    mode="primary"
                    style={styles.button}
                    isLoading={changePasswordMutation.isPending}
                    onPress={changePasswordSubmitHandler}
                    >
                        Sıfırla
                    </Button>
                </>
            )}

        </Modal>
    );
}

const styles = StyleSheet.create({
    title:{
        fontSize: sizes.titleMedium,
        color: "#323143",
        fontFamily: "exo-bold",
        textAlign: "center",
    },
    text: {
        fontFamily: "exo",
        color: "#acadb9",
        textAlign: "center",
    },
    input:{
        borderWidth: 1,
        borderColor: "#0001",
        marginTop: 8,
    },
    button:{
        marginVertical: 0,
        marginHorizontal: 0,
        height: 48,
        marginTop:16,
    },
    CodeFieldRoot:{
        marginVertical: 16,
        gap: 10,
    },
    cell: {
        flex: 1,
        aspectRatio: 1,
        borderWidth:1,
        borderColor: "#c2c3cb",
        borderRadius: 18,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: sizes.titleXLarge,
        fontFamily: "exo",
        color: "#323143",
    },
});