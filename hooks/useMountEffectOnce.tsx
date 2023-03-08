import React from 'react';

const useMountEffectOnce = (fn: () => void) => {
    const wasExecutedRef = React.useRef(false)
    React.useEffect(() => {
        if (!wasExecutedRef.current) {
            fn()
        }
        wasExecutedRef.current = true
    }, [fn])
}

export default useMountEffectOnce;
