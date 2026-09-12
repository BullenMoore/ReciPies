import {describe, expect, it} from "vitest";
import {parseSection} from "../src/parser/parseSection";

describe("parseSection - correct data construction testing", () => {

    it("titles are added when present", () => {
        const result = parseSection(
            "= Botten\n" +
            "\n" +
            "Börja med att sätta ugnen på 175°C\n" +
            "\n" +
            "= Glasyr\n" +
            "\n" +
            "Smält"
        );

        expect(result).toEqual([
            {
                "steps": [
                    {
                        "content": [
                            {
                                "type": "text",
                                "value": "Börja med att sätta ugnen på 175°C",
                            }
                        ],
                    },
                ],
                "title": "Botten",
            },
            {
                "steps": [
                    {
                        "content": [
                            {
                                "type": "text",
                                "value": "Smält",
                            }
                        ],
                    },
                ],
                "title": "Glasyr",
            },
        ]);
    });

    it("titles are not added when not present", () => {
        const result = parseSection(
            "\n" +
            "Börja med att sätta ugnen på 175°C\n" +
            "\n" +
            "Smält"
        );

        expect(result).toEqual([
            {
                "steps": [
                    {
                        "content": [
                            {
                                "type": "text",
                                "value": "Börja med att sätta ugnen på 175°C",
                            }
                        ],
                    },
                    {
                        "content": [
                            {
                                "type": "text",
                                "value": "Smält",
                            }
                        ],
                    },
                ],
                "title": undefined,
            },
        ]);
    });

    it("steps can appear before section titles", () => {
        const result = parseSection(
            "\n" +
            "Börja med att sätta ugnen på 175°C\n" +
            "\n" +
            "= Glasyr\n" +
            "\n" +
            "Smält"
        );

        expect(result).toEqual([
            {
                "steps": [
                    {
                        "content": [
                            {
                                "type": "text",
                                "value": "Börja med att sätta ugnen på 175°C",
                            }
                        ],
                    },
                ],
                "title": undefined,
            },
            {
                "steps": [
                    {
                        "content": [
                            {
                                "type": "text",
                                "value": "Smält",
                            }
                        ],
                    },
                ],
                "title": "Glasyr",
            },
        ]);
    });

});