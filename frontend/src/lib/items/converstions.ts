import { unitConversions, unitDecimalPlaces } from "@/config/unit-conversions";
import { Units } from "@/types";

export function isConvertable(fromUnit: Units, toUnit: Units): boolean {
    // Check if the units are the same
    if (fromUnit === toUnit) return true;

    return (
        unitConversions[fromUnit] !== undefined &&
        unitConversions[fromUnit][toUnit] !== undefined
    );
}

export function convertAmount(
    amount: number,
    fromUnit: Units,
    toUnit: Units
): number {
    if (fromUnit === toUnit) return amount;

    if (!unitConversions[fromUnit] || !unitConversions[fromUnit][toUnit]) {
        return amount;
    }

    const convertedAmount = amount * unitConversions[fromUnit][toUnit];

    const decimalPlaces = unitDecimalPlaces[toUnit] || 1;

    return parseFloat(convertedAmount.toFixed(decimalPlaces));
}