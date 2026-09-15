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
                amount: 200,
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
                amount: 200,
                unit: "g"
            },
            {
                type: "text",
                value: " och blanda"
            }
        ]);
    });



    it("parses several ingredients surrounded by text", () => {
        const result = parseInline(
            "Blanda @smör{200%g} och @mjölk{2%dl} blanda"
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Blanda "
            },
            {
                type: "ingredient",
                name: "smör",
                amount: 200,
                unit: "g"
            },
            {
                type: "text",
                value: " och "
            },
            {
                type: "ingredient",
                name: "mjölk",
                amount: 2,
                unit: "dl"
            },
            {
                type: "text",
                value: " blanda"
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

    it("parses equipment that is ended by an ingredient", () => {
        const result = parseInline(
            "#bunke @mjölk{2%dl}"
        );

        expect(result).toEqual([
            {
                type: "equipment",
                name: "bunke"
            },
            {
                type: "text",
                value: " "
            },
            {
                type: "ingredient",
                name: "mjölk",
                amount: 2,
                unit: "dl"
            }
        ]);
    });

    it("parses several equipment surrounded by text", () => {
        const result = parseInline(
            "Ta fram en #stor bunke{} och en #handvisp samtidigt"
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Ta fram en "
            },
            {
                type: "equipment",
                name: "stor bunke"
            },
            {
                type: "text",
                value: " och en "
            },
            {
                type: "equipment",
                name: "handvisp"
            },
            {
                type: "text",
                value: " samtidigt"
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
            "Låt stå ~{00:20-01:00:15}"
        );

        expect(result).toEqual([
            {
                type: "text",
                value: "Låt stå "
            },
            {
                type: "time",
                minSeconds: 20 * 60,
                maxSeconds: 60 * 60 + 15
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
                amount: 2,
                unit: "dl"
            },
            {
                type: "text",
                value: " och "
            },
            {
                type: "ingredient",
                name: "smör",
                amount: 100,
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

    it("ingredient with incorrect amount", () => {

        expect(() => parseInline("@Smör{ab45c%dl}")).toThrow("Invalid amount: ab45c");
    });


});