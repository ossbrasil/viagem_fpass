export const parseCPF = (cpf: string, reverse: boolean = false) => {
    // Remove any non-digit characters
    const cleaned = cpf.replace(/\D/g, '');
    if (reverse) return cleaned;
    // Apply the CPF mask
    let masked = cleaned;
    if (cleaned.length > 3) {
        masked = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    }
    if (cleaned.length > 6) {
        masked = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
            6,
        )}`;
    }
    if (cleaned.length > 9) {
        masked = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
            6,
            9,
        )}-${cleaned.slice(9, 11)}`;
    }
    return masked;
};
