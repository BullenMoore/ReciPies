import { describe, expect, it } from "vitest";
import { parseStep } from "../src/parser/parseStep";

describe("parseState - step formatting testing", () => {

    it("check correct amount of steps", () => {
        const result = parseStep(
            "Börja med att sätta ugnen på 175°C och klä en #form 30×40 cm{} med #bakplåtspapper.\n" +
            "\n" +
            "Smält @smör{200%g} i en kastrull och rör ner @mjölk{2%dl}, låt det svalna.\n" +
            "Vispa @ägg{4} och @socker{4%dl} fluffigt.\n" +
            "\n" +
            "\n" +
            "Blanda @vetemjöl{4%dl}, @kakao{1.25%dl}, @bakpulver{2.5%tsk} och @vaniljsocker{2%tsk} i en separat #bunke och sikta ner det i smeten. Vänd runt försiktigt till en klumpfri smet. Tillsätt smörblandningen och rör ihop till en jämn smet."
        );

        expect(result).toHaveLength(4);
    });





});