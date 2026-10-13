import { describe, expect, it } from "vitest";
import { parseEquipment } from "../../src/parser/elements/parseEquipment";

describe("parseEquipment - correct syntax testing", () => {

    it("equipment", () => {
        const result = parseEquipment(
            "#Bunke{}",
            1);

        expect(result).toEqual(
            {
                type: "equipment",
                name: "Bunke"
            }
        );
    });






});