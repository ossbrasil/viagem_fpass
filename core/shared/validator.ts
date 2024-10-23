export class Validator {
    static readonly cpf = (cpf: string) => {
        console.log(cpf);
        // Check if the length is 11 digits
        if (cpf.length !== 11) {
            return false;
        }

        // Check if all digits are the same
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        // Calculate the first verification digit
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let firstVerifyingDigit = sum % 11;
        firstVerifyingDigit =
            firstVerifyingDigit < 2 ? 0 : 11 - firstVerifyingDigit;

        // Check if the first verification digit is correct
        if (firstVerifyingDigit !== parseInt(cpf.charAt(9))) {
            return false;
        }

        // Calculate the second verification digit
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let secondVerifyingDigit = sum % 11;
        secondVerifyingDigit =
            secondVerifyingDigit < 2 ? 0 : 11 - secondVerifyingDigit;

        // Check if the second verification digit is correct
        return secondVerifyingDigit === parseInt(cpf.charAt(10));


    }
    static readonly password = (password: string) => password.length >= 6;
    static readonly email = (email: string) => /\S+@\S+\.\S+/.test(email)
}
