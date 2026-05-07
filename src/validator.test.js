const {
  isValidText,
  isValidEmail,
  isValidPostalCode,
  isAdult,
  validateForm
} = require("./validators");

describe("validators unit tests", () => {
  test("should validate text", () => {
    expect(isValidText("Alexandre")).toBe(true);
    expect(isValidText("Nice")).toBe(true);
    expect(isValidText("A")).toBe(false);
    expect(isValidText("Alex123")).toBe(false);
    expect(isValidText("")).toBe(false);
  });

  test("should validate email", () => {
    expect(isValidEmail("test@test.com")).toBe(true);
    expect(isValidEmail("alexandre@mail.fr")).toBe(true);
    expect(isValidEmail("test")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
    expect(isValidEmail("@test.com")).toBe(false);
  });

  test("should validate french postal code", () => {
    expect(isValidPostalCode("06000")).toBe(true);
    expect(isValidPostalCode("75001")).toBe(true);
    expect(isValidPostalCode("6000")).toBe(false);
    expect(isValidPostalCode("060000")).toBe(false);
    expect(isValidPostalCode("abcde")).toBe(false);
  });

  test("should validate adult user", () => {
    const currentDate = new Date("2026-05-05");

    expect(isAdult("2000-01-01", currentDate)).toBe(true);
    expect(isAdult("2010-01-01", currentDate)).toBe(false);
    expect(isAdult("", currentDate)).toBe(false);
    expect(isAdult("wrong-date", currentDate)).toBe(false);
  });

  test("should return errors for invalid form", () => {
    const user = {
      firstName: "A",
      lastName: "123",
      email: "email",
      birthDate: "2010-01-01",
      city: "N1ce",
      postalCode: "6000"
    };

    const errors = validateForm(user);

    expect(errors.firstName).toBe("Prénom invalide");
    expect(errors.lastName).toBe("Nom invalide");
    expect(errors.email).toBe("Email invalide");
    expect(errors.birthDate).toBe("Vous devez avoir au moins 18 ans");
    expect(errors.city).toBe("Ville invalide");
    expect(errors.postalCode).toBe("Code postal invalide");
  });

  test("should return no error for valid form", () => {
    const user = {
      firstName: "Alexandre",
      lastName: "Perez",
      email: "alexandre@mail.fr",
      birthDate: "2000-01-01",
      city: "Nice",
      postalCode: "06000"
    };

    const errors = validateForm(user);

    expect(errors).toEqual({});
  });
});