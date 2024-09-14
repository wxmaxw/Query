import { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { showMessage } from "react-native-flash-message";
import { sendRequest, queryClient } from "../util/http";

import Input from "../components/Icon";
import Button from "../components/Button";
import ScreenContainer from "../components/ScreenContainer";
import sizes from "../constants/sizes";
import ForgotPasswordScreen from "../ForgotPasswordScreen";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [isForgotPassword, setisForgotPassword] = useState(false);

  const [kimlikNo, setKimlikNo] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smscode, setSmscode] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [classId, setClassId] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => {
      return sendRequest({ api: `/users/${mode}`, data });
    },

    onSuccess: (response) => {
      if (response.status !== 200) return;
      if (mode === "login") login;
    },

    //başarılı başarısız durumda da çalışır.
    onSettled: (response) => {
      if (response.status === 200) return; //değeri ve türün eşit olmasını karşılaştırır
      showMessage({ message: response.message, type: "danger" });
    },
  });

  const allClassQuery = useQuery({
    queryKey: ["allClasses"], //önbellekte saklanması içi unique key
    queryFn: () => sendRequest({ api: "/class/getAllClasses" }), //api'den veri çekilmesi için tetiklenen fonk.
  });

  const allClasses = allClassQuery?.data?.data; //? chaining içn kullanılır null veya undefine dönmesin diye
  // data?.data ise api cevabının içinde bir alt veri katmanına erişmeye  çalıştırığımızı gösteririr

  const studentTypeQuery = useQuery({
    queryKey: ["typeInfoForStudent"],
    queryFn: () => sendRequest({ api: "/user/sendTypeInfoForStudent" }),
  });

  const typeInfoForStudent = studentTypeQuery?.data?.data;

  const input0 = (
    <Input
      key="input0"
      value={kimlikNo}
      onChangeText={setKimlikNo}
      label="T.C. Kimlik No"
      inputMode="numeric"
      maxLength={11}
    />
  );

  const input1 = (
    <Input
      key="input"
      value={password}
      onChangeText={setPassword}
      label="Şifreniz"
      password
      login={mode === "login"}
      onForgotPasswordPress={() => setisForgotPassword(true)}
    />
  );
  const input2 = (
    <Input
      key="input2"
      value={firstName}
      onChangeText={setFirstName}
      label="İsim"
    />
  );
  const input3 = (
    <Input
      key="input3"
      value={lastName}
      onChangeText={setLastName}
      label="Soyisim"
    />
  );
  const input4 = (
    <Input
      key="input4"
      value={email}
      onChangeText={setEmail}
      label="E-mail"
      inputMode="email"
    />
  );
  const input5 = (
    <Input
      key="input5"
      value={phone}
      onChangeText={setPhone}
      label="Telefon Numarası"
      inputMode="tel"
      phone
    />
  );
  const input6 = (
    <Input
      key="input6"
      value={smscode}
      onChangeText={setSmscode}
      label="Sms Doğrulama Kodu"
      inputMode="numeric"
    />
  );
  const input7 = (
    <Input
      key="input7"
      value={schoolType}
      onSelect={setSchoolType}
      label="Okul türü"
      select
      options={(typeInfoForStudent && typeInfoForStudent[0]?.schoolTypes) || []}
    />
  );
  const input8 = (
    <Input
      key="input8"
      value={classId}
      onSelect={setClassId}
      label="Sınıf"
      select
      options={allClasses || []}
      optionLabel="className"
      optionValue="_id"
    />
  );

  const content = {
    login: [input0, input1],
    sendCodeWithPhoneNumberForRegister: [input2, input3, input0, input4, input5],
    register: [input6, input1, input7, input8] 
  };

  const illustraionHeight = {
    login: {height: sizes.vw * 0.8},
    sendCodeWithPhoneNumberForRegister: {height: sizes.vw * 0.6},
    register: {height: sizes.vw * 0.8},
  };

  const submitButtonModes = {
    login: {
      title: "Giriş Yap",
      data: {kimlikNo, password, pushToken: queryClient.getQuery(["pushToken"])}
    },
    sendCodeWithPhoneNumberForRegister: {
      title: "İleri",
      data: {phone},
      nextMode: "login",
    },
    register: {
      title: "Kaydol",
      data: {kimlikNo, password, firstName, lastName, email, phone,smscode, schoolType, classId, role: "student"},
      nextMode: "login",
    },
  };

  const submitHandler = () => {
    mutation.mutate(submitButtonModes[mode].data);
  };

  return (
    <ScreenContainer style={StyleSheet.container} scrollEnabled={false}>
      <Image source={authScreenIllustration} style={[styles.illustration, illustraionHeight[mode]]} resizeMode="contain"/>
      {content[mode]?.map((input) => input)}
      <Button mode="primary" onPress={submitHandler} isLoading = {mutation.isPending}>{submitButtonModes[mode]?.title}</Button>
      {mode ==="login" && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>Henüz hesabın yok mu?</Text>
          <Button mode="text" textStyle={styles.textButtonText} onPress={() => setMode("sendCodeWithPhoneNumberForRegister")}>
            KayıtOl
          </Button>
        </View>
      )}
      <ForgotPasswordScreen isOpen={isForgotPassword} onClose={() => setisForgotPassword(false)}/>  
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: colors.bgPrimary,
  },
  illustration: {
      aspectRatio: 1,
      alignSelf: "center",
  },
  textContainer: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      marginTop: "auto",
  },
  text: {
      fontFamily: "exo",
      color: colors.title500,
      fontSize: sizes.titleSmall,
  },
  textButtonText: {
      fontSize: sizes.titleSmall,
  },
});