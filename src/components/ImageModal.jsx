import React from "react";
import "./ImageModal.css";

export default function ImageModal({ src, title, description, onClose, onNext, onPrev }) {
  if (!src) return null;

  // Simple check for video by file extension
  const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(src);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video
            src={src}
            controls
            autoPlay
            loop
            className="modal-media"
          />
        ) : (
          <img src={src} alt={title} className="modal-media" />
        )}

        <div className="modal-nav">
          <button className="modal-arrow" onClick={onPrev}>←</button>
          <button className="modal-close" onClick={onClose}>×</button>
          <button className="modal-arrow" onClick={onNext}>→</button>
        </div>

        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
