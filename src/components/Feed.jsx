import React, { useState, useEffect, useRef } from "react";
import FeedItem from "./FeedItem";
import LinkedInIcon from "../assets/linkedin.svg"; // <-- added
import InstagramIcon from "../assets/instagram.svg"; // <-- added

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

export default function Feed({ bio, items, onImageClick }) {
  const [visibleCount, setVisibleCount] = useState(5);
  const feedRef = useRef(null);

  const [bioVisible, setBioVisible] = useState({
    cover: false,
    title: false,
    text: false,
  });

  useEffect(() => {
    if (!bio) return;

    const timers = [
      setTimeout(() => setBioVisible((v) => ({ ...v, cover: true })), 200),
      setTimeout(() => setBioVisible((v) => ({ ...v, title: true })), 600),
      setTimeout(() => setBioVisible((v) => ({ ...v, text: true })), 1000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [bio]);

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = feedRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setVisibleCount((prev) => Math.min(prev + 5, items.length));
      }
    };

    const current = feedRef.current;
    current.addEventListener("scroll", handleScroll);
    return () => current.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  return (
    <div className="feed-container" ref={feedRef}>
      {/* --- Bio Section --- */}
      {bio && (
        <div className="feed-wrapper bio-wrapper">
          <div className="bio-section">
            {bio.images[0] && (
              <img
                className={`bio-image bio-fade ${bioVisible.cover ? "visible delay-1" : ""}`}
                src={pickBestImageUrl(bio.images[0]) || bio.images[0]}
                alt={bio.title}
              />
            )}
            <h2 className={`bio-title bio-fade ${bioVisible.title ? "visible delay-2" : ""}`}>
              {bio.title}
            </h2>

            {/* --- Social Icons --- */}
            <div className={`bio-social bio-fade ${bioVisible.title ? "visible delay-2" : ""}`}>
              <a href="https://www.linkedin.com/in/jobe-ulshafer-986152166?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">
                <img src={LinkedInIcon} alt="LinkedIn" />
              </a>
              <a href="https://www.instagram.com/jobe.wallace" target="_blank" rel="noopener noreferrer">
                <img src={InstagramIcon} alt="Instagram" />
              </a>
            </div>

            <p className={`bio-text bio-fade ${bioVisible.text ? "visible delay-2" : ""}`}>
              {bio.description}
            </p>
          </div>
        </div>
      )}

      {/* --- Project Feed Items --- */}
      {items.slice(0, visibleCount).map((item, index) => (
        <div key={index} className="feed-wrapper">
          <FeedItem item={item} onImageClick={onImageClick} />
        </div>
      ))}
    </div>
  );
}
