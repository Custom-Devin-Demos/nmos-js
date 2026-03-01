import { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

export const useDebouncedCallback = (
    callback: (...args: any[]) => void,
    delay: number
) => useMemo(() => debounce(callback, delay), [callback, delay]);

const useDebounce = (value: any, delay: number) => {
    const previousValue = useRef(value);
    const [currentValue, setCurrentValue] = useState(value);
    const debouncedCallback = useDebouncedCallback(
        (value: any) => setCurrentValue(value),
        delay
    );
    useEffect(() => {
        if (value !== previousValue.current) {
            debouncedCallback(value);
            previousValue.current = value;
        }
    }, [debouncedCallback, value]);
    return currentValue;
};

export default useDebounce;
