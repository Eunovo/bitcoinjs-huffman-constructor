import test, { ExecutionContext } from 'ava';
import { SortedList } from '../src/utils';

test(
    'insert 1 into []',
    testList([], 1, [1])
);

test(
    'insert 2 into [1]',
    testList([1], 2, [1, 2])
);

test(
    'insert 1 into [2]',
    testList([2], 1, [1, 2])
);

test(
    'insert 3 into [1, 2]',
    testList([1, 2], 3, [1, 2, 3])
);

test(
    'insert 2 into [1, 3]',
    testList([1, 3], 2, [1, 2, 3])
);

test(
    'insert 1 into [2, 3]',
    testList([2, 3], 1, [1, 2, 3])
);

test(
    'insert 2 into [1, 2, 3]',
    testList([1, 2, 3], 2, [1, 2, 2, 3])
);

function testList(input: number[], insert: number, expected: number[]) {
    return (t: ExecutionContext<unknown>) => {
        const sortedList = new SortedList(input, (a, b) => a - b);
        sortedList.insert(insert);
        t.deepEqual(sortedList.toArray(), expected);
    }
}
