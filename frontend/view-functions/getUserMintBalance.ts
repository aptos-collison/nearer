import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { T_MINTING_MODULE } from "@/constants";

type GetUserMintBalanceArguments = {
  fa_address: string;
  user_address: string;
};

export const getUserMintBalance = async ({ fa_address, user_address }: GetUserMintBalanceArguments) => {
  const userMintedAmount = await aptosClient().view<[string]>({
    payload: {
      function: `${AccountAddress.from(T_MINTING_MODULE)}::launchpad::get_mint_balance`,
      functionArguments: [fa_address, user_address],
    },
  });

  return Number(userMintedAmount[0]);
};
