/* eslint-disable no-undef */

import { applyFormula } from "../../src/utilities/utils";
import "@testing-library/jest-dom/extend-expect";

test("Utils - applyFormula - addition test", () => {
    const obj = {};
    const columnName = "total";
    obj[columnName] = "=SUM(10:20)";

    let result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 30 });

    obj[columnName] = "=ADD(10:20)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 30 });

    obj[columnName] = "=sum(10:20)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 30 });

    obj[columnName] = "=add(10:20)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 30 });

    obj[columnName] = "=add(20:20)";

    result = applyFormula(obj, columnName);
    expect(result).not.toEqual({ total: 30 });
});

test("Utils - applyFormula - multiplication test", () => {
    const obj = {};
    const columnName = "total";
    obj[columnName] = "=MUL(10:20)";

    let result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 200 });

    obj[columnName] = "=mul(10:20)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 200 });

    obj[columnName] = "=mul(20:20)";

    result = applyFormula(obj, columnName);
    expect(result).not.toEqual({ total: 200 });
});

test("Utils - applyFormula - subtraction test", () => {
    const obj = {};
    const columnName = "total";
    obj[columnName] = "=SUB(20:10)";

    let result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 10 });

    obj[columnName] = "=sub(20:10)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 10 });

    obj[columnName] = "=DIFF(20:10)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 10 });

    obj[columnName] = "=diff(20:10)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 10 });

    obj[columnName] = "=diff(20:20)";

    result = applyFormula(obj, columnName);
    expect(result).not.toEqual({ total: 10 });
});

test("Utils - applyFormula - min test", () => {
    const obj = {};
    const columnName = "total";
    obj[columnName] = "=min(20:10)";

    let result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 10 });

    obj[columnName] = "=MIN(20:10)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 10 });

    obj[columnName] = "=MIN(20:20)";

    result = applyFormula(obj, columnName);
    expect(result).not.toEqual({ total: 10 });
});

test("Utils - applyFormula - max test", () => {
    const obj = {};
    const columnName = "total";
    obj[columnName] = "=max(20:10)";

    let result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 20 });

    obj[columnName] = "=MAX(20:10)";

    result = applyFormula(obj, columnName);
    expect(result).toEqual({ total: 20 });

    obj[columnName] = "=MAX(20:20)";

    result = applyFormula(obj, columnName);
    expect(result).not.toEqual({ total: 10 });
});

test("Utils - applyFormula - no calculation test", () => {
    const obj = {};
    const columnName = "total";
    obj[columnName] = "=abc(20:10)";

    const result = applyFormula(obj, columnName);
    expect(result).toEqual(obj);
});
