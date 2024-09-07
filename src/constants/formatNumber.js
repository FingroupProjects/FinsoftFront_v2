export default function formatPrice(price) {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
        return '0.00';
    }
    return numericPrice.toFixed(2);
}
