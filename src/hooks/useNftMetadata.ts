import { readSmartContract } from "@/utils/contracts/contracts";
import { contractsInterfaces } from "../services/viem";
import {useEffect, useState} from "react";

export const useNftMetadata = (contractAddr) => {
    const [metadata, setMetadata] = useState<any>({name: null, uri: null})
    const getMetadata = async () => {
        const name = await readSmartContract(
            contractAddr,
            contractsInterfaces["NftTicket"].abi,
            "name",
        ) as string;
        const uri = await readSmartContract(
            contractAddr,
            contractsInterfaces["NftTicket"].abi,
            "uri",
            [0] as any,
        ) as string;

        setMetadata({
            name,
            uri
        })
    }
    useEffect(() => {
        if(!!contractAddr){
            getMetadata()
        }
    }, [contractAddr])
    return {...metadata};
};
