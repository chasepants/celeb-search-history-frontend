import React from "react";
import { render, screen } from "@testing-library/react";
import BioCard from "../components/BioCard";

describe("BioCard", () => {
  test("renders bio data", () => {
    const bio = {
      name: "Brad Pitt",
      age: 61,
      bio: "Test bio.",
      photo: "https://via.placeholder.com/150"
    };
    render(<BioCard bio={bio} />);
    expect(screen.getByText("Brad Pitt")).toBeInTheDocument();
    expect(screen.getByText("Age: 61")).toBeInTheDocument();
    expect(screen.getByText("Test bio.")).toBeInTheDocument();
    expect(screen.getByAltText("Brad Pitt")).toHaveAttribute("src", "https://via.placeholder.com/150");
  });
});