import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { CallWithERC2771Request, ERC2771Type, GelatoRelay } from "@gelatonetwork/relay-sdk";
import { fetcher } from "../requests/requests";
import {useActiveAccount, useActiveWalletChain} from "thirdweb/react";
import {useUserContext} from "../store/UserContext";

const useGaslessTransaction = () => {
  const [transactionState, setTransactionState] = useState({
    initiated: false,
    taskId: "",
    txHash: "",
    taskStatus: "",
    lastCheckMessage: ""
  });
  const signer = useActiveAccount() as any;

  const address = signer?.address;
  const chainId = useActiveWalletChain()?.id;
  const user = useUserContext();

  const updateTransactionState = (updates) => {
    setTransactionState((prevState) => ({ ...prevState, ...updates }));
  };

  const sendTransaction = useCallback(async (contractAddr, method, args, abi) => {
    if (!chainId || !address || !signer || !method) return;

    updateTransactionState({ initiated: true, taskId: '', txHash: '', taskStatus: 'Loading...' });

    try {
      const relay = new GelatoRelay();
      const contract = new ethers.Contract(contractAddr, abi, signer);
      const { data } = await contract.populateTransaction[method](...args);

      if (!data) return;

      const request: CallWithERC2771Request = {
        chainId: chainId as any,
        target: contractAddr,
        data: data as string,
        user: address,
      };

      const { struct, signature } = await relay.getSignatureDataERC2771(
        request,
        signer as any,
        ERC2771Type.SponsoredCall
      );

      const res = await fetcher("/api/gaslessTx", {
        method: "POST",
        body: JSON.stringify({
          signature,
          struct
        })
      });

      if (res.taskId) updateTransactionState({ taskId: res.taskId });
    } catch (error) {
      console.log("🚨 Error while sending gasless TX: ",(error as any).message);
      updateTransactionState({ taskStatus: 'Error', initiated: false });
    }
  }, [chainId, address, signer]);

  useEffect(() => {
    if (!transactionState.taskId) return;

    let statusQueryInterval: any = null;

    const getTaskState = async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${transactionState.taskId}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        const { taskState, transactionHash, lastCheckMessage, effectiveGasPrice, gasUsed } = responseJson.task;

        updateTransactionState({
          taskStatus: taskState,
          txHash: taskState === 'ExecSuccess' ? transactionHash : '',
          initiated: taskState !== 'ExecSuccess',
          lastCheckMessage
        });

        if (["ExecSuccess", "ExecReverted", "Cancelled"].includes(taskState)) {
          clearInterval(statusQueryInterval);
          if (taskState === "ExecSuccess") {
            await fetcher("api/gaslessTx/log", {
              method: "POST",
              body: JSON.stringify({
                gasSaved: effectiveGasPrice * gasUsed,
                userId: user.userId,
                taskId: transactionState.taskId
              }),
            });
          }
        }
      } catch (error) {
        console.log("🚨 Error while checking gasless TX: ", (error as any).message);
        updateTransactionState({ taskStatus: 'Error', initiated: false });
        clearInterval(statusQueryInterval);
      }
    };

    statusQueryInterval = setInterval(getTaskState, 1500);

    return () => {
      if (statusQueryInterval) {
        clearInterval(statusQueryInterval);
      }
    };
  }, [transactionState.taskId]);



  return { transactionState, address, chainId, sendTransaction };
};

export default useGaslessTransaction;
