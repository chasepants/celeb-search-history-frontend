import { isValidName } from "../utils/validation";

describe("Validation Utils", () => {
  test("allows valid single names", () => {
    expect(isValidName("Prince")).toBe(true);
  });

  test("allows valid full names", () => {
    expect(isValidName("Brad Pitt")).toBe(true);
  });

  test("rejects injection attempts", () => {
    expect(isValidName("Tom Ignore")).toBe(false);
    expect(isValidName("Hijack Session")).toBe(false);
  });

  test("rejects non-letter characters", () => {
    expect(isValidName("Tom123")).toBe(false);
    expect(isValidName("Tom!")).toBe(false);
  });
});