import * as React from 'react'

interface FormInputProps {
    handleChangeCb: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    name: string;
    placeholder: string;
    title: string;
    value: string;
}

export const FormInput = ({
    handleChangeCb,
    name,
    placeholder,
    title,
    value
}: FormInputProps) => (
    <>
        <h5>{title}</h5>
        <input name={name} placeholder={placeholder} value={value} onChange={handleChangeCb}/>
    </>
);
