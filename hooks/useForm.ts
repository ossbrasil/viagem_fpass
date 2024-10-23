import React, {useMemo} from "react";

export type FormErrors<T> = {
    [key in keyof T]?: string;
}

type UseFormProps<T> = {
    initialValues: T;
    validate?: (value: T) => FormErrors<T>;
    onSubmit: (value: T) => Promise<void>;
};
export type UseFormHook<T> = {
    values: T,
    setValues: React.Dispatch<React.SetStateAction<T>>;
    errors: FormErrors<T>;
    isSubmitting: boolean;
    handleChange: (name: string, value: any) => void;
    handleSubmit: () => Promise<void>;

};

function useForm<T>({initialValues, onSubmit, validate}: UseFormProps<T>): UseFormHook<T> {
    const [values, setValues] = React.useState<T>(initialValues);
    const [errors, setErrors] = React.useState<FormErrors<T>>({});
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

    // Utility function to update nested properties
    const setNestedValue = (obj: any, path: string[], value: any): any => {
        if (path.length === 1) {
            obj[path[0]] = value;
        } else {
            const key = path[0];
            if (!obj[key]) {
                obj[key] = {};
            }
            setNestedValue(obj[key], path.slice(1), value);
        }
        return obj;
    };
    const handleChange = (name: string, value: any) => {
        const keys = name.split('.');
        const updatedValues = setNestedValue({...values}, keys, value);
        setValues(updatedValues);
    };
    const handleSubmit = async () => {
        const validationErrors = validate ? validate(values) : {};
        console.log(validationErrors);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            await onSubmit(values);
            setIsSubmitting(false);
        }
    };
    return useMemo(() => ({
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setValues,
    }), [values, errors, isSubmitting]);
}

export default useForm;