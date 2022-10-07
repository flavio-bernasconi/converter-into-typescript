import { describe, expect, it } from "vitest";
import { converter } from "../src/App";

describe("Converter", () => {
  it("should be string", (ctx) => {
    const obj = {
      x: "test",
    };

    const res = converter(obj);
    expect(res).toEqual({ x: "string" });
  });

  it("should be number", (ctx) => {
    const obj = {
      x: 12,
    };

    const res = converter(obj);
    expect(res).toEqual({ x: "number" });
  });
  it("should be boolean", (ctx) => {
    const obj = {
      x: true,
    };

    const res = converter(obj);
    expect(res).toEqual({ x: "boolean" });
  });
  it("should be array of numbers", (ctx) => {
    const obj = {
      x: [1, 2, 3],
    };

    const res = converter(obj);
    expect(res).toEqual({ x: "number[]" });
  });
  it("should be array of strings", (ctx) => {
    const obj = {
      x: ["test", "text", "texxxt"],
    };

    const res = converter(obj);
    expect(res).toEqual({ x: "string[]" });
  });
  it("should be array of strings and numbers", (ctx) => {
    const obj = {
      x: ["test", "text", "texxxt", 1, 2, 3],
    };

    const res = converter(obj);
    expect(res).toEqual({ x: "(string|number)[]" });
  });
  it("should be null", (ctx) => {
    const obj = {
      x: null,
    };

    const res = converter(obj);
    expect(res).toEqual({ x: null });
  });
  it("should be an object", (ctx) => {
    const obj = {
      a: true,
      b: 1,
    };

    const res = converter(obj);
    expect(res).toEqual({ a: "boolean", b: "number" });
  });
  it("should be a nested object", (ctx) => {
    const obj = {
      nestedKey: { a: true, b: [1, 2, 3] },
    };

    const res = converter(obj);
    expect(res).toEqual({ nestedKey: { a: "boolean", b: "number[]" } });
  });
});
