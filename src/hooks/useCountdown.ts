import {useEffect, useRef} from "react";

export const useCountdown = (startTime, callbackFn, isActive) => {
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        if(isActive){
            clearInterval(intervalRef?.current)
            return;
        }
        const currentTime = new Date().getTime();
        if (currentTime >= startTime) {
            callbackFn();
            return;
        }
        const checkTime = () => {
            const currentTime = new Date().getTime();
            if (currentTime >= startTime) {
                callbackFn();
                clearInterval(intervalRef.current);
            }
        };

        intervalRef.current = setInterval(checkTime, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [startTime, callbackFn, isActive]);
};