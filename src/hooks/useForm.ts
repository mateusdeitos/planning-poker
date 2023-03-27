import { useState } from "react";


export const useForm = <T extends Record<string, any>>({ defaultValues = {} }: { defaultValues: Partial<T> }) => {
	const [values, setValues] = useState(defaultValues);

	return {
		register: (name: keyof typeof defaultValues) => {
			return {
				onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
					setValues({
						...values,
						[name]: e.target.value,
					});
				},
				value: values[name],
			}
		},
		getValues: () => values as Required<T>,
		getValue: (name: keyof typeof defaultValues) => values[name],
		reset: () => setValues(defaultValues),
	}
}