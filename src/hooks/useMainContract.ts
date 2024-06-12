import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialze } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

type ContractInitDataType = {
  counter_value: number;
  recent_sender: Address;
  owner_sender: Address;
};

const contractAddress = "EQAupsPLSwJcJdSdm2BQT-8dyMYbPr5WXpJxx-CFdQGrgaQY";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] =
    useState<null | ContractInitDataType>();

  const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialze(async () => {
    if (!client) return;
    const contract = new MainContract(Address.parse(contractAddress));

    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const value = await mainContract.getData();
      const { balance } = await mainContract.getBalance();

      setContractData({
        counter_value: value.number,
        recent_sender: value.recent_sender,
        owner_sender: value.owner_address,
      });

      setBalance(Number(balance));
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }

    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: async () => {
      console.log("sender", sender.address);
      return mainContract?.sendIncrement(sender, toNano("0.05"), 5);
    },

    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("1"));
    },

    sendWithdrawalRequest: () => {
      return mainContract?.sendWithdrawRequest(
        sender,
        toNano("0.05"),
        toNano("0.05")
      );
    },
  };
}
