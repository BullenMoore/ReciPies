import { describe, expect, it } from "vitest";
import { parseLine } from "../src/parser/parseLine";

describe("parseLine - correct syntax testing", () => {

    it("parses only text", () => {
        const result = parseLine(
            "Blanda",
            1);

        expect(result).toEqual([
            {
                type: "text",
                value: "Blanda"
            }
        ]);
    });

    it("parses text, ingredient, equipment and time together", () => {
        const result = parseLine(
            "Blanda @florsocker{2%dl} och @smör{100%g} i en #bunke{}. Häll i en #form{} och grädda i ugnen i ~{1}",
            1
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Blanda "
            },
            {
                type: "ingredient",
                name: "florsocker",
                lowerAmount: 2,
                upperAmount: 2,
                unit: "dl"
            },
            {
                type: "text",
                value: " och "
            },
            {
                type: "ingredient",
                name: "smör",
                lowerAmount: 100,
                upperAmount: 100,
                unit: "g"
            },
            {
                type: "text",
                value: " i en "
            },
            {
                type: "equipment",
                name: "bunke"
            },
            {
                type: "text",
                value: ". Häll i en "
            },
            {
                type: "equipment",
                name: "form"
            },
            {
                type: "text",
                value: " och grädda i ugnen i "
            },
            {
                type: "time",
                minSeconds: 60 * 60,
                maxSeconds: 60 * 60
            }
        ]);
    });
});

/*
describe("parseLine - incorrect syntax testing / error handling", () => {


});

 */