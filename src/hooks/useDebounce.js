import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Har keystroke par ek naya timer start hoga
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Agar user delay se pehle dobara type karta hai, toh purana timer clear ho jayega
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;