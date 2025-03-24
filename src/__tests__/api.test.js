import { fetchSearchHistory, fetchBioData } from "../utils/api";

describe("API Utils", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("fetchSearchHistory returns searches", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ searches: [{ title: "Test" }] })
    });
    const data = await fetchSearchHistory("Brad Pitt", null, null);
    expect(data.searches).toEqual([{ title: "Test" }]);
  });

  test("fetchSearchHistory throws on error", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Error" })
    });
    await expect(fetchSearchHistory("Brad Pitt", null, null)).rejects.toThrow("Error"); // Match exact message
  });

  test("fetchBioData returns bio data", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 123 }] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          name: "Brad Pitt",
          birthday: "1963-12-18",
          biography: "Test bio.",
          profile_path: "/test.jpg"
        })
      });
    const bio = await fetchBioData("Brad Pitt");
    expect(bio.name).toBe("Brad Pitt");
    expect(bio.age).toBe(61);
    expect(bio.bio).toBe("Test bio.");
    expect(bio.photo).toBe("https://image.tmdb.org/t/p/w200/test.jpg");
  });

  test("fetchBioData handles no data", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] })
    });
    const bio = await fetchBioData("Unknown");
    expect(bio.age).toBe("Unknown");
    expect(bio.bio).toBe("No biography available.");
  });
});