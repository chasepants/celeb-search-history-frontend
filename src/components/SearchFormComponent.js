import React, { useState, useEffect, useRef } from "react";
import BioCard from "./BioCard";
import SearchResults from "./SearchResults";
import { fetchSearchHistory, fetchBioData } from "../utils/api";
import { isValidName } from "../utils/validation";
import "../SearchForm.css";

function SearchFormComponent() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [results, setResults] = useState([]);
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(
    !!localStorage.getItem("captchaVerified")
  );
  const captchaRef = useRef(null);

  useEffect(() => {
    if (isCaptchaVerified || process.env.NODE_ENV === "development") return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.onload = () => {
      if (window.turnstile && captchaRef.current) {
        window.turnstile.render(captchaRef.current, {
          sitekey: process.env.REACT_APP_TURNSTILE_SITE_KEY,
          callback: (token) => {
            setCaptchaToken(token);
            setIsCaptchaVerified(true);
            localStorage.setItem("captchaVerified", "true");
          },
          "error-callback": () => setError("Search database is down"),
          theme: "light",
          action: "search"
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (window.turnstile && captchaRef.current) {
        window.turnstile.remove(captchaRef.current);
      }
    };
  }, [isCaptchaVerified]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setResults([]);
    setBio(null);

    const trimmedInput = input.trim();
    if (!isValidName(trimmedInput)) {
      setError("Please enter a valid celebrity name (letters only, no suspicious text).");
      return;
    }

    const sanitizedInput = trimmedInput;

    setIsLoading(true);
    setLoadingMessage("Querying Google Activity Database...");

    const messages = [
      "Querying Google Activity Database...",
      `Filtering for ${sanitizedInput}...`,
      "Gathering Google account bio...",
      "Gathering Results..."
    ];
    let messageIndex = 0;

    const messageInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex < messages.length) {
        setLoadingMessage(messages[messageIndex]);
      }
    }, 1500);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const startTime = Date.now();
      const searchData = await fetchSearchHistory(sanitizedInput, captchaToken, controller.signal);
      const endTime = Date.now();
      console.log("Search Response Time:", `${(endTime - startTime) / 1000}s`);
      clearTimeout(timeoutId);
      clearInterval(messageInterval);

      if (searchData.searches) {
        setResults(searchData.searches);
        const bioData = await fetchBioData(sanitizedInput);
        setBio(bioData);
      } else if (searchData.message) {
        setError(searchData.message);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError("Search database is down");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  };

  return (
    <div className="search-form">
      <form onSubmit={handleSubmit} className="search-form__form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a celebrity name"
          className="search-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="generate-btn"
          disabled={isLoading || (!isCaptchaVerified && process.env.NODE_ENV !== "development")}
        >
          Generate
        </button>
      </form>
      {!isCaptchaVerified && process.env.NODE_ENV !== "development" && (
        <div className="cf-turnstile" ref={captchaRef}></div>
      )}
      {isLoading && loadingMessage && (
        <div className="loading-message">{loadingMessage}</div>
      )}
      {bio && <BioCard bio={bio} />}
      {results.length > 0 && <SearchResults results={results} />}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default SearchFormComponent;