import { useState, useEffect } from "react";
import Splash from "../components/Splash";
import Feed from "../components/Feed";
import ImageModal from "../components/ImageModal";
import Logo from "../components/Logo";
import { getProjects, getBioPost } from "../strapi";
import "./Home.css";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashVideo, setSplashVideo] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [bioPost, setBioPost] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  useEffect(() => {
    async function loadContent() {
      try {
        const allProjects = await getProjects();
        const bio = await getBioPost();

        setBioPost(bio);

        if (!allProjects || allProjects.length === 0) return;

        // -------- SPLASH SELECTION ----------
        const splashItem = allProjects.find((p) => p.Slug === "logo-video");
        let splashUrl = null;

        if (splashItem?.Collection?.length > 0) {
          splashUrl = splashItem.Collection[0].url;
        } else if (splashItem?.Cover?.url) {
          splashUrl = splashItem.Cover.url;
        }

        setSplashVideo(splashUrl);

        // -------- TRANSFORM PROJECTS ----------
        const projectsFeed = allProjects
          .filter((p) => p.Slug !== "logo-video")
          .map((p) => {
            let description = "";

            if (Array.isArray(p.Description)) {
              description = p.Description
                .map((block) =>
                  block.children.map((c) => c.text).join("")
                )
                .join("\n");
            }

            let images = [];
            if (p.Cover?.url) images.push(p.Cover.url);
            if (p.Collection?.length > 0) {
              images.push(...p.Collection.map((m) => m.url));
            }

            return {
              title: p.Title || "No Title",
              description: description || "No description available",
              images,
              URL: p.URL || null, // <-- add the URL field
            };
          });

        setFeedItems({ bio, projectsFeed });
      } catch (err) {
        console.error("Error loading content:", err);
      }
    }

    loadContent();
  }, []);

  // ---------- FAILSAFE: ALWAYS EXIT SPLASH ----------
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ---------- MODAL HELPERS ----------
  const openModal = (item, index = 0) => {
    if (!item.images || item.images.length === 0) return;
    setModalImages(item.images);
    setModalIndex(index);
    setModalTitle(item.title);
    setModalDescription(item.description);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const nextImage = () =>
    setModalIndex((prev) => (prev + 1) % modalImages.length);

  const prevImage = () =>
    setModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);

  // ---------- SPLASH SCREEN ----------
  if (showSplash) {
    return splashVideo ? (
      <Splash videoUrl={splashVideo} onFinish={() => setShowSplash(false)} />
    ) : (
      <div className="loading-screen">
        <span className="loading-wipe">Loading...</span>
      </div>
    );
  }

  // ---------- MAIN CONTENT ----------
  return (
    <div className="feed-container">
      <Logo />

      {feedItems.projectsFeed && feedItems.bio ? (
        <Feed
          bio={feedItems.bio}
          items={feedItems.projectsFeed}
          onImageClick={openModal}
        />
      ) : (
        <div className="loading-screen">
          <span className="loading-wipe">Loading content...</span>
        </div>
      )}

      {modalOpen && (
        <ImageModal
          src={modalImages[modalIndex]}
          title={modalTitle}
          description={modalDescription}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}
