import { describe, expect, it } from "vitest";
import { parseInline } from "../src/parser/parseInline";

describe("parseInline - correct syntax testing", () => {

    it("parses only text", () => {
        const result = parseInline("Blanda");

        expect(result).toEqual([
            {
                type: "text",
                value: "Blanda"
            }
        ]);
    });

    it("parses only ingredient", () => {
        const result = parseInline(
            "@smör{200%g}"
        );

        expect(result).toEqual([
            {
                type: "ingredient",
                name: "smör",
                lowerAmount: 200,
                upperAmount: 200,
                unit: "g"
            }
        ]);
    });

    it("parses only ingredient with range", () => {
        const result = parseInline(
            "@smör{150-200%g}"
        );

        expect(result).toEqual([
            {
                type: "ingredient",
                name: "smör",
                lowerAmount: 150,
                upperAmount: 200,
                unit: "g"
            }
        ]);
    });

    it("parses only ingredient without an amount", () => {
        const result = parseInline(
            "@smör{}"
        );

        expect(result).toEqual([
            {
                type: "ingredient",
                name: "smör"
            }
        ]);
    });

    it("parses only ingredient without an unit", () => {
        const result = parseInline(
            "@smör{150}"
        );

        expect(result).toEqual([
            {
                type: "ingredient",
                name: "smör",
                lowerAmount: 150,
                upperAmount: 150
            }
        ]);
    });

    it("parses only ingredient with range and without an unit", () => {
        const result = parseInline(
            "@smör{150-200}"
        );

        expect(result).toEqual([
            {
                type: "ingredient",
                name: "smör",
                lowerAmount: 150,
                upperAmount: 200
            }
        ]);
    });

    it("parses text surrounding an ingredient", () => {
        const result = parseInline(
            "Blanda @smör{200%g} och blanda"
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Blanda "
            },
            {
                type: "ingredient",
                name: "smör",
                lowerAmount: 200,
                upperAmount: 200,
                unit: "g"
            },
            {
                type: "text",
                value: " och blanda"
            }
        ]);
    });

    it("parses only equipment", () => {
        const result = parseInline(
            "#bunke{}"
        );

        expect(result).toEqual([
            {
                type: "equipment",
                name: "bunke"
            }
        ]);
    });

    it("parses equipment and text that ends with space", () => {
        const result = parseInline(
            "Ta fram en #bunke och blanda"
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Ta fram en "
            },
            {
                type: "equipment",
                name: "bunke"
            },
            {
                type: "text",
                value: " och blanda"
            }
        ]);
    });

    it("parses only time", () => {
        const result = parseInline(
            "~{00:30:15}"
        );

        expect(result).toEqual([
            {
                type: "time",
                minSeconds: 30 * 60 + 15,
                maxSeconds: 30 * 60 + 15
            }
        ]);
    });

    it("parses text surrounding time", () => {
        const result = parseInline(
            "Ställ i ugnen i ~{00:30} och vänta"
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Ställ i ugnen i "
            },
            {
                type: "time",
                minSeconds: 30 * 60,
                maxSeconds: 30 * 60
            },
            {
                type: "text",
                value: " och vänta"
            }
        ]);
    });

    it("parses time with range", () => {
        const result = parseInline(
            "~{00:20-01:00:15}"
        );

        expect(result).toEqual([
            {
                type: "time",
                minSeconds: 20 * 60,
                maxSeconds: 60 * 60 + 15
            }
        ]);
    });

    it("parses only degrees", () => {
        const result = parseInline(
            "¤{200%C}"
        );

        expect(result).toEqual([
            {
                type: "degree",
                degrees: 200,
                unit: "C",
            }
        ]);
    });

    it("parses text surrounding degrees", () => {
        const result = parseInline(
            "Sätt ugnen på ¤{200%C} och vänta."
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Sätt ugnen på "
            },
            {
                type: "degree",
                degrees: 200,
                unit: "C",
            },
            {
                type: "text",
                value: " och vänta."
            }
        ]);
    });

    it("parses text, ingredient, equipment and time together", () => {
        const result = parseInline(
            "Blanda @florsocker{2%dl} och @smör{100%g} i en #bunke{}. Häll i en #form{} och grädda i ugnen i ~{1}"
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

describe("parseInline - incorrect syntax testing / error handling", () => {

    it("ingredient with incorrect number", () => {

        expect(() => parseInline("@Smör{ab45c%dl}")).toThrow("Invalid amount:");

        expect(() => parseInline("@Smör{ab45c-abc67d%dl}")).toThrow("Invalid amount:");
    });

    it("ingredient with incorrect range", () => {

        expect(() => parseInline("@Smör{150-200-250%dl}")).toThrow("Invalid range in ingredient structure.");
    });

    it("equipment with incorrect formatting", () => {

        expect(() => parseInline("#Stor bunke{3%l}")).toThrow("Invalid formatting for equipment.");
    });

    it("time with incorrect structure", () => {

        expect(() => parseInline("~{01:30:00:500}")).toThrow("Invalid time struture.");
    });

    it("time with incorrect range", () => {

        expect(() => parseInline("~{01:30-01:40-01:50}")).toThrow("Invalid range in time struture.");
    });

    it("time with incorrect format", () => {

        expect(() => parseInline("~{one:thirty}")).toThrow("Invalid time format:");
    });

    it("time with incorrect semantics (unrealistic time)", () => {

        expect(() => parseInline("~{01:60}")).toThrow("Semantic time error:");

        expect(() => parseInline("~{100:30}")).toThrow("Semantic time error:");

        //expect(() => parseInline("~{00:00}")).toThrow("Semantic time error:"); Is a timer on 0 an error or bad input? Should it error?
    });

    it("degrees with incorrect structure", () => {

        expect(() => parseInline("¤{200}")).toThrow("Invalid bracket structure:");
    });

    it("degrees with incorrect number", () => {

        expect(() => parseInline("¤{two hundred%C}")).toThrow("Invalid degrees number:");
    });

    it("degrees with incorrect unit", () => {

        expect(() => parseInline("¤{200%D}")).toThrow("Invalid degree unit:");

        expect(() => parseInline("¤{200%}")).toThrow("Invalid degree unit:");
    });

    it("degrees with incorrect structure", () => {

        expect(() => parseInline("¤{200%CF}")).toThrow("Invalid degree element structure:");
    });
});