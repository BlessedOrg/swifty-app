import { useEffect, useState } from "react";
import {
    getLotteryV1Data,
    readDepositedAmount,
    windowEthereum,
    selectWinners,
} from "@/utilscontracts";
import { useSigner } from "@thirdweb-dev/react";
import { waitForTransactionReceipt } from "../../services/viem";
import { useToast } from "@chakra-ui/react";
import { useConnectWallet } from "@/hooks/useConnect";
import {formatRandomNumber} from "@/utilsformatRandomNumber";
import {ICommonSaleData} from "@/hooks/sales/useSales";

export interface ILotteryV1Data extends ICommonSaleData{
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;

}

export const useLotteryV1 = (activeAddress) => {
    const { walletAddress } = useConnectWallet();
    const signer = useSigner();
    const toast = useToast();


    const [saleData, setSaleData] = useState<ILotteryV1Data>({
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
            readLotteryDataFromContract: async() => {},
            onSelectWinners: async() => {}
        };
    }

    const readLotteryDataFromContract = async () => {
        if (signer) {
            const res = await getLotteryV1Data(
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
                console.log("1️⃣LotteryV1 data: ", payload);
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

    const onSelectWinners = async () => {
        try {
            const res = await selectWinners(activeAddress, signer, toast);

            console.log("🚀 onSelectWinners TX - ", res);

            if (!!res) {
                const confirmation = await waitForTransactionReceipt(res, 3);

                if (confirmation?.status === "success") {
                    await readLotteryDataFromContract();

                    toast({
                        status: "success",
                        title: `Winners selected successfully!`,
                    });
                }
            }
            return res;
        } catch (e) {
            console.error(e);
        }
    };


    return {
        saleData,
        onSelectWinners,
        getDepositedAmount,
        readLotteryDataFromContract
    };
};


