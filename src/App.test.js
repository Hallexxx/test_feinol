import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App integration tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should render form", () => {
    render(<App />);

    expect(screen.getByText("Formulaire d'inscription")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Date de naissance")).toBeInTheDocument();
    expect(screen.getByLabelText("Ville")).toBeInTheDocument();
    expect(screen.getByLabelText("Code postal")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("should display errors on empty submit", () => {
    render(<App />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(screen.getByText("Prénom invalide")).toBeInTheDocument();
    expect(screen.getByText("Nom invalide")).toBeInTheDocument();
    expect(screen.getByText("Email invalide")).toBeInTheDocument();
    expect(screen.getByText("Vous devez avoir au moins 18 ans")).toBeInTheDocument();
    expect(screen.getByText("Ville invalide")).toBeInTheDocument();
    expect(screen.getByText("Code postal invalide")).toBeInTheDocument();

    expect(localStorage.getItem("user")).toBe(null);
  });

  test("should block user under 18", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Prénom"), {
      target: { value: "Alexandre" }
    });

    fireEvent.change(screen.getByLabelText("Nom"), {
      target: { value: "Perez" }
    });

    fireEvent.change(screen.getByLabelText("Mail"), {
      target: { value: "alexandre@mail.fr" }
    });

    fireEvent.change(screen.getByLabelText("Date de naissance"), {
      target: { value: "2010-01-01" }
    });

    fireEvent.change(screen.getByLabelText("Ville"), {
      target: { value: "Nice" }
    });

    fireEvent.change(screen.getByLabelText("Code postal"), {
      target: { value: "06000" }
    });

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Vous devez avoir au moins 18 ans")).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBe(null);
  });

  test("should save user in localStorage when form is valid", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Prénom"), {
      target: { value: "Alexandre" }
    });

    fireEvent.change(screen.getByLabelText("Nom"), {
      target: { value: "Perez" }
    });

    fireEvent.change(screen.getByLabelText("Mail"), {
      target: { value: "alexandre@mail.fr" }
    });

    fireEvent.change(screen.getByLabelText("Date de naissance"), {
      target: { value: "2004-08-11" }
    });

    fireEvent.change(screen.getByLabelText("Ville"), {
      target: { value: "Nice" }
    });

    fireEvent.change(screen.getByLabelText("Code postal"), {
      target: { value: "06000" }
    });

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Utilisateur enregistré")).toBeInTheDocument();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    expect(savedUser).toEqual({
      firstName: "Alexandre",
      lastName: "Perez",
      email: "alexandre@mail.fr",
      birthDate: "2004-08-11",
      city: "Nice",
      postalCode: "06000"
    });
  });
});