import { useState } from 'react';

// eslint-disable-next-line no-unused-vars
const functionValidations = {
    require: (value) => (value !== undefined && value !== null && value) || `this field is required`,
    isEmail: (value) => value.includes('@'),
    minLength: (value, min) => value.length >= min,
    maxLength: (value, max) => value.length <= max,
    passwordLevel: (value, level) => {
        switch (level) {
            case 2:
                return value.length >= 8;
            case 3:
                return value.length >= 10;
            default:
                return value.length >= 10;
        }
    }
}


/*  Example initial form since Component
    const [{ email, password }, { onInputChange, handleSubmit }] = useForm({
        email: { value: '', validations: { require: true, isEmail: true, minLength: 10, maxLength: 15 } },
        password: { value: '', validations: { require: true, passwordLevel: 2 } },
    })
*/
export const useForm = (initialForm = {}) => {

    const [formState, setFormState] = useState(initialForm);

    const isValidForm = () => {
        const resultValidation = Object.keys(initialForm).reduce((accum, propForm) => {
            const { value: valuePopForm, validations } = formState[propForm]
            formState[propForm].errors = []
            Object.keys(validations).forEach(nameValidation => {
                const valueValidation = validations[nameValidation]
                const resultError = functionValidations[nameValidation](valuePopForm, valueValidation)
                if (resultError) formState[propForm].errors.push(resultError)
            });
            return accum
        }, false)
        setFormState({ ...formState })
        return resultValidation
    };

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        formState[name].value = value;
        setFormState({
            ...formState,
        });
    }

    const onResetForm = () => {
        setFormState(initialForm);
    }

    const handleSubmit = (e, onSubmit) => {
        e.preventDefault();
        console.log(formState);
        if (isValidForm()) onSubmit()
    }
    return [{ ...formState },
    {
        onInputChange,
        handleSubmit,
        onResetForm,
        isValidForm
    }]
}
