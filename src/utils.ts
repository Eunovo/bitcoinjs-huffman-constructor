export class SortedList<T> {
    constructor(
        private array: Array<T>,
        private compare: (a: T, b: T) => number
    ) {
        this.array.sort(compare);
    }

    public pop() {
        return this.array.shift();
    }

    public insert(element: T) {
        let high = this.array.length - 1;
        let low = 0;
        let mid;
        let highElement, lowElement, midElement;
        let compareHigh, compareLow, compareMid;
        let targetIndex;
        while (true) {
            if (high < low) {
                targetIndex = low;
                break;
            }
            
            mid = Math.floor((low + high) / 2);

            highElement = this.array[high];
            lowElement = this.array[low];
            midElement = this.array[mid];
            
            compareHigh = this.compare(element, highElement);
            compareLow = this.compare(element, lowElement);
            compareMid = this.compare(element, midElement);

            if (low === high) {
                // Target index is either to the left or right of element at low
                if (compareLow <= 0) targetIndex = low;
                else targetIndex = low + 1;
                break;
            }

            if (compareHigh >= 0) {
                // Target index is to the right of high
                low = high;
                continue;
            }
            if (compareLow <= 0) {
                // Target index is to the left of low
                high = low;
                continue;
            }

            if (compareMid <= 0) {
                // Target index is to the left of mid
                high = mid;
                continue;
            }

            // Target index is to the right of mid
            low = mid + 1;
        }

        this.array.splice(targetIndex, 0, element);
        return targetIndex;
    }

    public length() {
        return this.array.length;
    }

    public toArray() {
        return this.array;
    }
}
