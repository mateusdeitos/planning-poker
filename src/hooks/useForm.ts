import { useState } from "react";


export const useForm = ({ defaultValues = {} }: { defaultValues: Record<string, any> }) => {
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
		getValues: () => values,
		getValue: (name: keyof typeof defaultValues) => values[name],
		reset: () => setValues(defaultValues),
	}
}