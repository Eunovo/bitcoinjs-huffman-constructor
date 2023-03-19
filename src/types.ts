import { Tapleaf, Taptree } from "bitcoinjs-lib/src/types";

export type Inputs = { weight: number, leaf: Tapleaf }[];
export type Node = {
    weight: number,
    node: Taptree
}
