import React, { useState, useEffect, useRef } from "react";
import FeedItem from "./FeedItem";
import "./feed.css";

function pickBestImageUrl(cover) {
  if (!cover) return null;
  if (cover.formats) {
    if (cover.formats.large?.url) return cover.formats.large.url;
    if (cover.formats.medium?.url) return cover.formats.medium.url;
    if (cover.formats.small?.url) return cover.formats.small.url;
    if (cover.formats.thumbnail?.url) return cover.formats.thumbnail.url;
  }
  if (cover.url) return cover.url;
  if (cover.data?.attributes?.url) return cover.data?.attributes?.url;
  if (Array.isArray(cover.data) && cover.data[0]?.attributes?.url)
    return cover.data[0]?.attributes?.url;
  return null;
}

export default function Feed({ bio, items, onImageClick }) {
  const [visibleCount, setVisibleCount] = useState(10); // show first 10 initially
  const feedRef = useRef(null);

  // Normalize bio
  const normalizedBio = bio
    ? {
        title: bio.Title || "Bio",
        description: Array.isArray(bio.Description)
          ? bio.Description.map((block) =>
              block.children.map((c) => c.text).join("")
            ).join("\n")
          : bio.Description || "No bio available.",
        images: (() => {
          const url = pickBestImageUrl(bio.CoverImage);
          return url ? [url] : [];
        })(),
        isBio: true,
      }
    : null;

  // Endless scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = feedRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // near bottom
        setVisibleCount((prev) =>
          Math.min(prev + 10, items.length)
        );
      }
    };

    const current = feedRef.current;
    current.addEventListener("scroll", handleScroll);
    return () => current.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  return (
    <div className="feed-container" ref={feedRef}>
      {normalizedBio && (
        <div className="feed-wrapper feed-item-bio">
          <FeedItem item={normalizedBio} onImageClick={onImageClick} />
        </div>
      )}

      {items.slice(0, visibleCount).map((item, index) => (
        <div key={index} className="feed-wrapper">
          <FeedItem item={item} onImageClick={onImageClick} />
        </div>
      ))}
    </div>
  );
}
