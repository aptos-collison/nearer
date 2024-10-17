import { NETWORK } from "@/constants";
import { Base, AptosConfig } from "@aptos-labs/ts-sdk";

const aptos = new Base(new AptosConfig({ network: NETWORK }));

// Reuse same Base instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}
