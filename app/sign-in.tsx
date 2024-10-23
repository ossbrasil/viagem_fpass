import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import CustomInputField from "@/components/custom-input-field";
import CustomButton, {ButtonType} from "@/components/custom-button";
import Icon from "@/components/icon";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useRef, useState} from "react";
import {useApp} from "@/core/context/app-context";
import {useModal} from "@/core/context/modal-context";
import useForm, {FormErrors} from "@/hooks/useForm";
import {Validator} from "@/core/shared/validator";
import LoadingModal from "@/components/modal/loading-modal";
import {router} from "expo-router";
import Toast from "react-native-root-toast";

export interface SignInForm {
    email: string;
    password: string;
}

export default function SignIn() {
    const {authAPI} = useApp();
    const {openModal, closeModal} = useModal();
    const insets = useSafeAreaInsets();
    const passwordRef = useRef<TextInput>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const focusPassword = () => {passwordRef.current?.focus()}
    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    // Form Hook
    const validate = (values: SignInForm) => {
        let errors: FormErrors<SignInForm> = {};
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!Validator.email(values.email)) {
            errors.email = "Email is invalid";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors;
    }
    const onSubmit = async (values: SignInForm) => {
        openModal('log-in', LoadingModal({text: 'Efetuando Login'}))
        const success = await authAPI.login(values);
        closeModal('log-in');
        if (success !== undefined) {
            if (!success) {
                const toast = Toast.show('Email ou senha incorretos!', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                });
                setTimeout(function hideToast() {
                    Toast.hide(toast);
                }, 5000);
            } else router.replace("/");
        }
    }
    const {values, errors, handleChange, handleSubmit} = useForm<SignInForm>({
        initialValues: {email: '', password: ''},
        onSubmit,
        validate
    });
    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            <Image source={require('@/assets/images/logo_preto_simples.png')}
                   resizeMode="contain"
                   style={styles.image}/>
            <CustomInputField
                placeholder="Email"
                name="email"
                value={values.email}
                errors={errors.email}
                handleChangeText={handleChange}
                keyboardType="email-address"
                prefixIcon={<Icon name="mail-outline"/>}
                onSubmitEditing={focusPassword}
                blurOnSubmit={false}
            />
            <CustomInputField
                customRef={passwordRef}
                secureTextEntry={!showPassword}
                name={"password"}
                placeholder="Senha"
                value={values.password}
                errors={errors.password}
                handleChangeText={handleChange}
                prefixIcon={<Icon name="lock-closed-outline"/>}
                suffixIcon={<Icon name={!showPassword ? "eye-outline" : "eye-off-outline"}
                                  onPress={togglePasswordVisibility}/>}
            />
            <View style={{flexDirection: 'row'}}>
                <CustomButton
                    title={'Entrar'}
                    type={ButtonType.MAIN}
                    size={'lg'}
                    onPress={handleSubmit}
                />
            </View>
            <Text style={styles.forget}>Esqueci a senha</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FAFAFA'
    },
    image: {
        width: 250,
        height: 200,
        marginTop: 20,
        marginBottom: 20
    },
    forget: {
        color: '#666',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 8
    }
});

