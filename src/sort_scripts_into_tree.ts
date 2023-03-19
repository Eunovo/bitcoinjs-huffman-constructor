import { Taptree } from "bitcoinjs-lib/src/types";
import { Inputs, Node } from "./types";
import { SortedList } from "./utils";

export function sortScriptsIntoTree(inputs: Inputs): Taptree | undefined {
    const nodes: Node[] = inputs
        .map((value) => ({
            weight: value.weight,
            node: value.leaf
        }));
        
    const sortedNodes = new SortedList(
        nodes,
        (a, b) => a.weight - b.weight
    ); // Create a list sorted in ascending order of frequency

    let newNode: Node;
    let nodeA: Node, nodeB: Node;
    while (sortedNodes.length() > 1) {
        // Construct a new node from the two nodes with the least frequency
        nodeA = sortedNodes.pop()!; // There will always be an element to pop
        nodeB = sortedNodes.pop()!; // because loop ends when length <= 1
        newNode = {
            weight: nodeA.weight + nodeB.weight,
            node: [nodeA.node, nodeB.node]
        };
        // Place newNode back into sorted list
        sortedNodes.insert(newNode);
    }

    // Last node in sortedNodes is the root node
    const root = sortedNodes.pop();
    return root?.node;
}
