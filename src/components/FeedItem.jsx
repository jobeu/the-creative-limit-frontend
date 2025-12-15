import React, { useState } from "react";
import "./FeedItem.css";

export default function FeedItem({ item, onImageClick }) {
  if (!item) return null;

  const [index, setIndex] = useState(0);
  const hasMultiple = item.images && item.images.length > 1;

  const next = () => setIndex((i) => (i + 1) % item.images.length);
  const prev = () => setIndex((i) => (i - 1 + item.images.length) % item.images.length);

  // Normalize URL to include protocol if missing
  const normalizedURL = item.URL
    ? item.URL.startsWith("http://") || item.URL.startsWith("https://")
      ? item.URL
      : `https://${item.URL}`
    : null;

  return (
    <div className="feed-item">
      <h1>{item.title}</h1>
      <p>{item.description}</p>

      {/* IMAGE WRAPPER */}
      <div className="feeditem-image-wrapper">
        {item.images[index] && (
          <img
            className="cover-image"
            src={item.images[index]}
            alt={item.title}
            onClick={() => onImageClick(item, index)}
          />
        )}

        {hasMultiple && (
          <div className="feeditem-nav">
            <button className="feeditem-arrow" onClick={prev}>←</button>
            <button className="feeditem-arrow" onClick={next}>→</button>
          </div>
        )}
      </div>

      {/* SEE MORE BUTTON */}
      {normalizedURL && (
        <div className="see-more-wrapper">
          <a
            href={normalizedURL}
            target="_blank"
            rel="noopener noreferrer"
            className="see-more-button"
          >
            View Project
          </a>
        </div>
      )}
    </div>
  );
}
