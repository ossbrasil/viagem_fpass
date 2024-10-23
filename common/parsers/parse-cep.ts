export const parseCEP = (cep: string, reverse: boolean = false) => {
    // Remove any non-numeric characters
    cep = cep.replace(/\D/g, '');
    if (reverse) return cep;
    // Apply the mask
    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    return cep;
};