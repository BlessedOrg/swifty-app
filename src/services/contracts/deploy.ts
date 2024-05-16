import { account, client, waitForTransactionReceipt } from "../viem";
import { log, LogType } from "@/prisma/models";

const setBaseContracts = async (contractAddr, abi, nonce, sellerId) => {
  try {
    const setBaseContractsTx = await client.writeContract({
      address: contractAddr,
      functionName: "setBaseContracts",
      args: [
        "0xA69bA2a280287405907f70c637D8e6f1B278E613", // NFT
        "0x8A5245bbF85e6fF38217bed701eE0d747a312BDa", // LotteryV1
        "0x33cccA1593041DD1029F8673c8214b40BCd8E51B", // LotteryV2
        "0x549958cDEd1Ac2DED1349766F034B6FfDC3e8502", // AuctionV1
        "0x84043de27023E609E18eca87299Ef41887D74Fb4" // AuctionV2
      ],
      abi,
      account,
      nonce,
    });
    console.log("⚾ setBaseContractsTx: ", setBaseContractsTx)
    const receipt = await waitForTransactionReceipt(setBaseContractsTx);
    nonce++;
    return receipt;
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    nonce++;
    if (errorMessage.includes("nonce")) {
      return await setBaseContracts(contractAddr, abi, nonce, sellerId)
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const createSale = async (contractAddr, abi, nonce, sale, appOperatorAddress) => {
  try {
    const createSaleTx = await client.writeContract({
      address: contractAddr,
      functionName: "createSale",
      args: [{
        _seller: sale.seller.walletAddr,
        _gelatoVrfOperator: process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR as string,
        _blessedOperator: appOperatorAddress as string,
        _owner: sale.seller.walletAddr,
        _lotteryV1TicketAmount: sale.lotteryV1settings.ticketsAmount,
        _lotteryV2TicketAmount: sale.lotteryV2settings.ticketsAmount,
        _auctionV1TicketAmount: sale.auctionV1settings.ticketsAmount,
        _auctionV2TicketAmount: sale.auctionV2settings.ticketsAmount,
        _ticketPrice: sale.priceCents / 100,
        _finishAt: new Date(sale.finishAt).getTime(),
        _uri: `https://blessed.fan/api/events/${sale.id}/`,
        _usdcContractAddr: "0x39008557c498c7B620Ec9F882e556faD8ADBdCd5",
        _multisigWalletAddress: process.env.MULTISIG_WALLET_ADDRESS as string
      }],
      abi,
      account,
      nonce
    });
    console.log("💸 createSaleTx: ", createSaleTx)
    const receipt = await waitForTransactionReceipt(createSaleTx);
    nonce++;
    return receipt;
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    nonce++;
    if (errorMessage.includes("nonce too low")) {
      return await createSale(contractAddr, abi, nonce, sale, appOperatorAddress)
    } else {
      await createErrorLog(sale.seller.id, (error as any).message);
    }
  }
};

const requestRandomNumber = async (contractAddr, abi, nonce, sellerId) => {
  try {
    const requestRandomnessTx = await client.writeContract({
      address: contractAddr,
      functionName: "requestRandomness",
      args: [],
      abi,
      account,
      nonce,
    });
    console.log("🎲 requestRandomnessTx: ", requestRandomnessTx)
    const receipt = await waitForTransactionReceipt(requestRandomnessTx);
    nonce++;
    return receipt;
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    nonce++;
    if (errorMessage.includes("nonce too low")) {
      return await requestRandomNumber(contractAddr, abi, nonce, sellerId)
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const setSeller = async (contractAddr, abi, nonce, seller) => {
  try {
    const setSellerTx = await client.writeContract({
      address: contractAddr,
      functionName: "setSeller",
      args: [seller.walletAddr],
      abi,
      account,
      nonce,
    });
    console.log("🛒 setSellerTx: ", setSellerTx)
    const receipt = await waitForTransactionReceipt(setSellerTx);
    nonce++;
    return receipt;
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    nonce++;
    if (errorMessage.includes("nonce too low")) {
      return await setSeller(contractAddr, abi, nonce, seller)
    } else {
      await createErrorLog(seller.id, (error as any).message);
    }
  }
};

const createErrorLog = async (userId, payload) => {
  await log.create({
    data: {
      userId,
      type: LogType["ticketSaleCreationFailure"],
      payload: {
        payload
      }
    }
  })
};

export {
  requestRandomNumber,
  createSale,
  setSeller,
  setBaseContracts,
  createErrorLog
}