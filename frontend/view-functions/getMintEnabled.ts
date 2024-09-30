import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { T_MINTING_MODULE } from "@/constants";

type GetMintEnabledArguments = {
  fa_address: string;
};

export const getMintEnabled = async ({ fa_address }: GetMintEnabledArguments) => {
  const mintEnabled = await aptosClient().view<[boolean]>({
    payload: {
      function: `${AccountAddress.from(T_MINTING_MODULE)}::launchpad::is_mint_enabled`,
      functionArguments: [fa_address],
    },
  });

  return mintEnabled[0];
};
