import React from "react";
import { render, screen } from "@testing-library/react";
import SearchResults from "../components/SearchResults";

describe("SearchResults", () => {
  test("renders initial results and lazy loads more", async () => {
    const results = Array(10).fill().map((_, i) => ({
      title: `Search ${i}`,
      timestamp: "2025-03-22",
      device: "Desktop",
      browser: "Chrome",
      ip: "Location hidden"
    }));
    render(<SearchResults results={results} />);
    expect(screen.getByText("Search 0")).toBeInTheDocument();
    expect(screen.getByText("Search 5")).toBeInTheDocument(); // Mock triggers immediately
  });

  test("shows premium message at 25 results", () => {
    const results = Array(25).fill().map((_, i) => ({
      title: `Search ${i}`,
      timestamp: "2025-03-22",
      device: "Desktop",
      browser: "Chrome",
      ip: "Location hidden"
    }));
    render(<SearchResults results={results} />);
    expect(screen.getByText("Upgrade to Premium for more results")).toBeInTheDocument();
  });
});