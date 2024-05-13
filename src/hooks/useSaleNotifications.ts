import {useEffect, useState} from "react";

export const useSaleNotifications = (saleData: ILotteryV1Data | ILotteryV2Data | IAuctionV1Data | IAuctionV2Data | null | undefined) => {
    const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
    const [isNotificationCardHidden, setIsNotificationCardHidden] = useState(false);

    const onToggleNotificationCard = () => {
        setIsNotificationCardHidden(prev => !prev);
    }


    useEffect(()=> {
        if(saleData && !isAnimationTriggered && !isNotificationCardHidden && saleData?.isWinner){
            setIsAnimationTriggered(true);
        }
    }, [saleData])


return {
    isNotificationCardHidden,
    isAnimationTriggered,
    onToggleNotificationCard,
}
}