import { computed } from 'vue';
export default function formatInputAmount(input) {
    input = input.toString();

    if (input[input.length - 1] === '.') {
        if ((input.match(/\./g) || []).length === 1) {
            return input;
        }
    }

    if ((input.match(/\./g) || []).length > 1) {
        return null;
    }

    const decimalIndex = input.indexOf('.');
    if (decimalIndex !== -1 && decimalIndex < input.length - 2) {
        return null;
    }

    const parsedNumber = parseFloat(input);

    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    }
    return null;
}

