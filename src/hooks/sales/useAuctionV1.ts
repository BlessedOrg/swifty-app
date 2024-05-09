import { useEffect, useState } from "react";
import {
    getAuctionV1Data,
    readDepositedAmount,
    windowEthereum,
} from "@/utilscontracts";
import { useSigner } from "@thirdweb-dev/react";
import { useConnectWallet } from "@/hooks/useConnect";
import {formatRandomNumber} from "@/utilsformatRandomNumber";


export const useAuctionV1 = (activeAddress) => {
    const { walletAddress } = useConnectWallet();
    const signer = useSigner();


    const [saleData, setSaleData] = useState<IAuctionV1Data | any>({
        winners: [],
        users: [],
        lastWinner: 0,
        myNumber: 0,
        winningChance: 0,
        missingFunds: 0,
        price: 0,
        position: 0,
        userFunds: 0,
        vacancyTicket: 0,
        contractAddress: activeAddress,
        randomNumber: 0,
    });

    if (!windowEthereum) {
        console.log(
            "🚨 useSales.tsx - [window.ethereum] !",
        );
        return {

            saleData,
            getDepositedAmount: async() => {},
            readLotteryDataFromContract: async() => {}
        };
    }

    const readLotteryDataFromContract = async () => {
        if (signer) {
            const res = await getAuctionV1Data(
                signer,
                activeAddress,
            );
            if (res) {

                const findUserIndex = res.users?.findIndex(
                    (i) => i === walletAddress,
                );
                const payload = {
                    ...res,
                    contractAddress: activeAddress,
                    myNumber: findUserIndex === -1 ? 0 : findUserIndex + 1,
                    randomNumber: formatRandomNumber(res.randomNumber, res.vacancyTicket || 0),
                    isOwner: res.sellerWalletAddress === walletAddress,
                };
                setSaleData((prev) => ({
                    ...prev,
                    ...payload,
                }));
                console.log("3️⃣ AuctionV1 data: ", payload);
                return res;
            }
        } else {
            console.log("🚨 EventLottery.tsx - Signer is required to read data.");
        }
    };

    const getDepositedAmount = async () => {
        if (signer) {
            const amount = await readDepositedAmount(activeAddress, signer);
            console.log("Deposited amount : ", amount);

        } else {
            console.log("🚨 EventLottery.tsx - Signer is required to read data.");
        }
    };

    useEffect(() => {
        if (!!signer && !!activeAddress) {
            readLotteryDataFromContract();
            getDepositedAmount();
        }
    }, [signer, walletAddress]);





    return {
        saleData,
        getDepositedAmount,
        readLotteryDataFromContract
    };
};


