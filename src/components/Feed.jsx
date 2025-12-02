import React, { useState, useEffect, useRef } from "react";
import FeedItem from "./FeedItem";
import "./feed.css";

// Utility to pick the best image from various formats
function pickBestImageUrl(cover) {
  if (!cover) return null;

  if (cover.formats) {
    if (cover.formats.large?.url) return cover.formats.large.url;
    if (cover.formats.medium?.url) return cover.formats.medium.url;
    if (cover.formats.small?.url) return cover.formats.small.url;
    if (cover.formats.thumbnail?.url) return cover.formats.thumbnail.url;
  }

  if (cover.url) return cover.url;
  if (cover.data?.attributes?.url) return cover.data.attributes.url;
  if (Array.isArray(cover.data) && cover.data[0]?.attributes?.url)
    return cover.data[0].attributes.url;

  return null;
}

export default function Feed({ items, onImageClick }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const feedRef = useRef(null);

  // Endless scroll: load more items as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = feedRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setVisibleCount((prev) => Math.min(prev + 10, items.length));
      }
    };

    const current = feedRef.current;
    current.addEventListener("scroll", handleScroll);
    return () => current.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  return (
    <div className="feed-container" ref={feedRef}>
      {items.slice(0, visibleCount).map((item, index) => (
        <div key={index} className="feed-wrapper">
          <FeedItem item={item} onImageClick={onImageClick} />
        </div>
      ))}
    </div>
  );
}
