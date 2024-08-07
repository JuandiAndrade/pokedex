
import { useEffect, useState } from 'react';

export const useDebouncedValue = (input: string = '', time: number = 500) => {

	const [debouncedValue, setDebouncedValue] = useState(input);


	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(input)
		}, time);

		// si la persona esta escribiendo mucho yo tengo que ir limbiando el timeout, entonces el return
		return () => {
			clearTimeout(timeout);
		}
	}, [input])

	return debouncedValue
}
