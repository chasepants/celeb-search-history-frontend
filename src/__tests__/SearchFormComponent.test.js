import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchFormComponent from "../components/SearchFormComponent";
import { fetchSearchHistory, fetchBioData } from "../utils/api";

jest.mock("../utils/api");

describe("SearchFormComponent", () => {
  beforeEach(() => {
    fetchSearchHistory.mockReset();
    fetchBioData.mockReset();
    localStorage.clear();
    jest.useFakeTimers();
    process.env.NODE_ENV = "development"; // Ensure dev mode for all tests
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders search form", () => {
    render(<SearchFormComponent />);
    expect(screen.getByPlaceholderText("Enter a celebrity name")).toBeInTheDocument();
    expect(screen.getByText("Generate")).toBeInTheDocument();
  });

  test("shows error for invalid name", async () => {
    render(<SearchFormComponent />);
    const input = screen.getByPlaceholderText("Enter a celebrity name");
    const button = screen.getByText("Generate");

    await act(async () => {
      fireEvent.change(input, { target: { value: "Tom Ignore" } });
      fireEvent.click(button);
    });

    const errorElement = await screen.findByText("Please enter a valid celebrity name (letters only, no suspicious text).", { timeout: 2000 });
    expect(errorElement).toBeInTheDocument();
  });

  test("fetches and displays results and bio in dev mode", async () => {
    fetchSearchHistory.mockResolvedValue({
      searches: [{ title: "Test Search", timestamp: "2025-03-22", device: "Desktop", browser: "Chrome", ip: "Location hidden" }]
    });
    fetchBioData.mockResolvedValue({
      name: "Brad Pitt",
      age: 61,
      bio: "Test bio.",
      photo: "https://via.placeholder.com/150"
    });

    render(<SearchFormComponent />);
    const input = screen.getByPlaceholderText("Enter a celebrity name");
    const button = screen.getByText("Generate");

    await act(async () => {
      fireEvent.change(input, { target: { value: "Brad Pitt" } });
      fireEvent.click(button);
    });

    expect(await screen.findByText("Brad Pitt")).toBeInTheDocument();
    expect(await screen.findByText("Age: 61")).toBeInTheDocument();
    expect(await screen.findByText("Test Search")).toBeInTheDocument();
  });

  test("shows loading messages", async () => {
    fetchSearchHistory.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ searches: [] }), 5000)));
    render(<SearchFormComponent />);
    const input = screen.getByPlaceholderText("Enter a celebrity name");
    const button = screen.getByText("Generate");

    await act(async () => {
      fireEvent.change(input, { target: { value: "Brad Pitt" } });
      fireEvent.click(button);
    });

    expect(screen.getByText("Querying Google Activity Database...")).toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByText("Filtering for Brad Pitt...")).toBeInTheDocument();
  });
});