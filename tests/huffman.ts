import test, { ExecutionContext } from 'ava';
import { Inputs } from '../src/types';
import { sortScriptsIntoTree } from '../src/sort_scripts_into_tree';
import { Tapleaf } from 'bitcoinjs-lib/src/types';

const scriptBuff = Buffer.from('');

test(
    'test empty array',
    testLeafDistances(
        [],
        []
    )
);

test(
    'it should return only one node for a single leaf',
    testLeafDistances(
        [{ weight: 1, leaf: { output: scriptBuff } }],
        [0]
    )
);


test(
    'it should return a balanced tree for a list of scripts with equal weights',
    testLeafDistances(
        [
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            }
        ],
        [2, 2, 2, 2]
    )
);

test(
    'it should return an optimal binary tree for a list of scripts with weights [1, 2, 3, 4, 5]',
    testLeafDistances(
        [
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 2,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 3,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 4,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 5,
                leaf: {
                    output: scriptBuff
                }
            }
        ],
        [3, 3, 2, 2, 2]
    )
);

test(
    'it should return an optimal binary tree for a list of scripts with weights [1, 2, 3, 3]',
    testLeafDistances(
        [
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 2,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 3,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 3,
                leaf: {
                    output: scriptBuff
                }
            }
        ],
        [3, 3, 2, 1]
    )
);

test(
    'it should return an optimal binary tree for a list of scripts with some negative weights: [1, 2, 3, -3]',
    testLeafDistances(
        [
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 2,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 3,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: -3,
                leaf: {
                    output: scriptBuff
                }
            }
        ],
        [3, 2, 1, 3]
    )
);

test(
    'it should return an optimal binary tree for a list of scripts with some weights specified as infinity',
    testLeafDistances(
        [
            {
                weight: 1,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: Number.POSITIVE_INFINITY,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: 3,
                leaf: {
                    output: scriptBuff
                }
            },
            {
                weight: Number.NEGATIVE_INFINITY,
                leaf: {
                    output: scriptBuff
                }
            }
        ],
        [3, 1, 2, 3]
    )
);

function testLeafDistances(input: Inputs, expectedDistances: number[]) {
    return (t: ExecutionContext<unknown>) => {
        let tree = sortScriptsIntoTree(input);

        if (tree === undefined) {
            // No tree
            t.deepEqual([], expectedDistances);
            return;
        }

        if (!Array.isArray(tree)) {
            // tree is just one node
            t.deepEqual([0], expectedDistances);
            return;
        }

        const leaves = input.map((value) => value.leaf);

        const map = new Map<Tapleaf, number>(); // Map of leaf to actual distance
        let currentDistance = 1;
        let currentArray: Array<Tapleaf[] | Tapleaf> = tree as any;
        let nextArray: Array<Tapleaf[] | Tapleaf> = [];
        while (currentArray.length > 0) {
            currentArray.forEach((value) => {
                if (Array.isArray(value)) {
                    nextArray = nextArray.concat(value);
                    return;
                }
                map.set(value, currentDistance);
            });

            currentDistance += 1; // New level
            currentArray = nextArray;
            nextArray = [];
        }

        const actualDistances = leaves.map(value => map.get(value));
        t.deepEqual(actualDistances, expectedDistances);
    }
}
