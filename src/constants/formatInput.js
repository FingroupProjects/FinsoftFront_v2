export default function formatInputAmount(input) {
    input = input.toString();

    // Remove any non-digit and non-decimal characters
    input = input.replace(/[^0-9.]/g, '');

    // Limit total length to 9 characters
    if (input.length > 9) {
        return null;
    }

    // Handle decimal point cases
    if (input[input.length - 1] === '.') {
        if ((input.match(/\./g) || []).length === 1) {
            return input;
        }
    }

    if ((input.match(/\./g) || []).length > 1) {
        return null;
    }

    const decimalIndex = input.indexOf('.');
    if (decimalIndex !== -1 && decimalIndex < input.length - 3) {
        return input.slice(0, decimalIndex + 3);
    }

    const parsedNumber = parseFloat(input);

    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    }
    return null;
}

