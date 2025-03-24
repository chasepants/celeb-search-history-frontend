import React, { useState, useEffect, useRef } from "react";
import "../SearchForm.css";

function SearchResults({ results }) {
  const [visibleResults, setVisibleResults] = useState([]);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (results.length > 0) {
      setVisibleResults(results.slice(0, 5));
    }
  }, [results]);

  useEffect(() => {
    if (visibleResults.length >= results.length || visibleResults.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleResults((prev) => {
            const nextCount = Math.min(prev.length + 5, results.length);
            return results.slice(0, nextCount);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [visibleResults, results]);

  return (
    <div className="results-container">
      {visibleResults.map((result, index) => (
        <div className="result-item" key={index}>
          <h3 className="result-title">{result.title}</h3>
          <p className="result-timestamp">{result.timestamp}</p>
          <p className="result-device">Device: {result.device}</p>
          <p className="result-browser">Browser: {result.browser}</p>
          <p className="result-ip">{result.ip}</p>
        </div>
      ))}
      {visibleResults.length < results.length && (
        <div ref={loadMoreRef} className="load-more">Loading more...</div>
      )}
      {visibleResults.length === 25 && (
        <p className="premium-message">Upgrade to Premium for more results</p>
      )}
    </div>
  );
}

export default SearchResults;