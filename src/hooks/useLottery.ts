import {useEffect, useMemo, useState} from "react";
import {
    deposit,
    getLotteriesDataWithoutAuctionV2,
    getAuctionV2Data,
    readDepositedAmount,
    readMinimumDepositAmount,
    withdraw,
} from "@/utilscontracts";
import {useSigner} from "@thirdweb-dev/react";
import {waitForTransactionReceipt} from "../services/viem";
import {useToast} from "@chakra-ui/react";
import {useUser} from "@/hooks/useUser";
import {cutWalletAddress} from "@/utilscutWalletAddress";
import {useConnectWallet} from "@/hooks/useConnect";

export interface ILotteryData {
    winners: string[] | null;
    users: string[] | null;
    tickets: number | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    missingFunds: number | null;
    price: number | null;
    position: number | null;
    userFunds: number | null;
    targetNumber: number | null;
    vacancyTicket: number | null;
    contractAddress?: string
    randomNumber:  number
}

export const useLottery = (addresses, activeAddress) => {
    const {walletAddress} = useConnectWallet()

    const signer = useSigner();
    const [isDepositLoading, setIsDepositLoading] = useState(false);
    const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
    const {address} = useUser();
    const toast = useToast();

    const [userData, setUserData] = useState({
        balance: 0,
        username: cutWalletAddress(address),
        avatar: "/images/profile.png",
    });

    const [lotteryData, setLotteryData] = useState<ILotteryData>({
        winners: [],
        users: [],
        tickets: 0,
        lastWinner: 0,
        myNumber: 0,
        winningChance: 0,
        missingFunds: 0,
        price: 0,
        position: 0,
        userFunds: 0,
        targetNumber: 0,
        vacancyTicket: 0,
        contractAddress: activeAddress,
        randomNumber: 0,
    });

    if (!!addresses.some(i => !i.address) || !window?.ethereum) {
        console.log(
            "🚨 useLottery.tsx - missing lotteryContractAddr or metamask [window.ethereum] !",
        );
        return {
            onDepositHandler: null,
            onWithdrawHandler: null,
            userData: userData,
            lotteryData: lotteryData,
            isDepositLoading: null,
            isWithdrawLoading: null,
        };
    }


    const readLotteryDataFromContract = async () => {
        if (signer) {
            const currentAddress = addresses.find(i => i.address === activeAddress)
            const isAuctionV2 = currentAddress?.id === "auctionV2";
            let res
            if (isAuctionV2) {
                const data = await getAuctionV2Data(signer, activeAddress)
                res = data
            } else {
                const data = await getLotteriesDataWithoutAuctionV2(signer, activeAddress, currentAddress?.id)
                res = data
            }
            if (res) {
                console.log(res)
               const filteredUsersAddresses = removeDuplicatesUsers(res.users || [])
            const findUserIndex = filteredUsersAddresses.findIndex(i => i === walletAddress)
                const payload = {
                    ...res,
                    users: filteredUsersAddresses,
                    contractAddress: activeAddress,
                    myNumber: findUserIndex === -1 ? 0 : findUserIndex +1,
                    randomNumber: formatNumber(res.randomNumber, res.vacancyTicket || 0)

                }
                setLotteryData((prev) => ({
                    ...prev,
                    ...payload
                }));
                console.log("🦦 Lottery data: ", payload);
                return res
            }
        } else {
            console.log("🚨 EventLottery.tsx - Signer is required to read data.");
        }
    };

    const getDepositedAmount = async () => {
        if (signer) {
            const amount = await readDepositedAmount(activeAddress, signer);
            console.log("Deposited amount : ", amount)
            setUserData((prev) => ({
                ...prev /**/,
                balance: Number(amount),
            }));
        } else {
            console.log("🚨 EventLottery.tsx - Signer is required to read data.");
        }
    };

    useEffect(() => {
        if (!!signer && !!activeAddress) {
            readLotteryDataFromContract();
            getDepositedAmount();

        }
    }, [signer, activeAddress, walletAddress]);

    const onWithdrawHandler = async () => {
        try {
            const res = await withdraw(activeAddress, signer, toast);
            if (!!res) {
                console.log("🦦 Withdraw hash: ", res);

                setIsWithdrawLoading(true);

                const confirmation = await waitForTransactionReceipt(res, 1);

                await getDepositedAmount();
                await readLotteryDataFromContract();

                if (confirmation?.status === "success") {
                    setIsWithdrawLoading(false);
                    toast({
                        status: "success",
                        title: `Withdraw Successfully!`,
                    });
                }
            } else {
                toast({
                    status: "error",
                    title: `Something went wrong, try again later!`,
                });
            }
        } catch (e) {
            console.error(e);
            setIsWithdrawLoading(false);
        }
    };
    const onDepositHandler = async (amount) => {
        try {
            const minAmount = await readMinimumDepositAmount(activeAddress);

            if (Number(minAmount) > amount) {
                toast({
                    status: "error",
                    title: `Minimum amount of deposit if $${Number(minAmount)}`,
                });

                return;
            }

            console.log("🌳 minAmount: ", Number(minAmount));

            const depoHash = await deposit(
                activeAddress,
                amount,
                signer,
                toast,
            );
            setIsDepositLoading(true);
            const confirmation = await waitForTransactionReceipt(depoHash, 1);
            console.log("Confirmation", confirmation);

            await getDepositedAmount();

            if (confirmation?.status === "success") {
                setIsDepositLoading(false);
                toast({
                    status: "success",
                    title: `Deposited Successfully!`,
                });
            }
            await readLotteryDataFromContract();
        } catch (e) {
            console.error(e);
            setIsDepositLoading(false);
        }
    };


    return {
        onDepositHandler,
        onWithdrawHandler,
        userData,
        lotteryData,
        isDepositLoading,
        isWithdrawLoading,
    };
};

const removeDuplicatesUsers = (array: string[]): string[] => {
    return array.filter((item, index) => array.indexOf(item) === index);
}
function formatNumber(num: bigint | number, tickets: number) {

    return Number(num) % tickets
}