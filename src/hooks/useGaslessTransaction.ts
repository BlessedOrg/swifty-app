import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { CallWithERC2771Request, ERC2771Type, GelatoRelay } from "@gelatonetwork/relay-sdk";
import { useAddress, useChainId, useSigner } from "@thirdweb-dev/react";
import { swrFetcher } from "../requests/requests";

const useGaslessTransaction = (contractAddr, method, args, abi) => {
  const [transactionState, setTransactionState] = useState({
    initiated: false,
    taskId: "",
    txHash: "",
    taskStatus: "",
  });
  const address = useAddress();
  const chainId = useChainId();
  const signer = useSigner();

  const updateTransactionState = (updates) => {
    setTransactionState((prevState) => ({ ...prevState, ...updates }));
  };

  const sendTransaction = useCallback(async () => {
    if (!chainId || !address || !signer || !method) return;

    updateTransactionState({ initiated: true, taskId: '', txHash: '', taskStatus: 'Loading...' });

    try {
      const relay = new GelatoRelay();
      const contract = new ethers.Contract(contractAddr, abi, signer);
      const { data } = await contract.populateTransaction[method](...args);

      if (!data) return;

      const request: CallWithERC2771Request = {
        chainId,
        target: contractAddr,
        data,
        user: address,
      };

      const { struct, signature } = await relay.getSignatureDataERC2771(
        request,
        signer as any,
        ERC2771Type.SponsoredCall
      );

      const res = await swrFetcher("/api/gaslessTx", {
        method: "POST",
        body: JSON.stringify({
          signature,
          struct
        })
      });

      if (res.taskId) updateTransactionState({ taskId: res.taskId });
    } catch (error) {
      console.error(error);
      updateTransactionState({ taskStatus: 'Error', initiated: false });
    }
  }, [chainId, address, signer, method, args, contractAddr]);

  useEffect(() => {
    if (!transactionState.taskId) return;

    const getTaskState = async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${transactionState.taskId}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        const { taskState, transactionHash } = responseJson.task;

        updateTransactionState({
          taskStatus: taskState,
          txHash: taskState === 'ExecSuccess' ? transactionHash : '',
          initiated: taskState !== 'ExecSuccess',
        });
      } catch (error) {
        console.error(error);
        updateTransactionState({ taskStatus: 'Error', initiated: false });
      }
    };

    const statusQueryInterval = setInterval(getTaskState, 1500);

    return () => clearInterval(statusQueryInterval);
  }, [transactionState.taskId]);

  return { ...transactionState, address, chainId, sendTransaction };
};

export default useGaslessTransaction;
