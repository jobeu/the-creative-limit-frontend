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

  const [feedItems, setFeedItems] = useState({
    bio: null,
    projectsFeed: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  // ---------- Lock body during splash ----------
  useEffect(() => {
    if (showSplash) {
      document.body.style.position = "fixed";
      document.body.style.width = "100vw";
      document.body.style.height = "100dvh";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    }
  }, [showSplash]);

  // ---------- Load content ----------
  useEffect(() => {
    async function loadContent() {
      try {
        // Fetch all projects
        const allProjects = await getProjects();

        // Fetch the new bio from assets
        const bio = await getBioPost();

        // --------- DEBUG LOG ----------
        console.log("DEBUG Home.jsx: bio received from getBioPost():", bio);

        // ---------- Transform BIO from ASSETS ----------
        let bioItem = null;
        if (bio) {
          const description = Array.isArray(bio.Text_Content)
            ? bio.Text_Content.map((block) =>
                block.children.map((c) => c.text).join("")
              ).join("\n")
            : "";

          bioItem = {
            title: bio.Display_Title || bio.Title || "Bio",
            description,
            images: bio.Cover?.url ? [bio.Cover.url] : [],
            URL: null,
            isBio: true,
          };

          console.log("DEBUG Home.jsx: bioItem after transformation:", bioItem);
        }

        // ---------- Find splash video project ----------
        const splashItem = allProjects?.find((p) => p.Slug === "logo-video");
        const splashUrl =
          splashItem?.Collection?.[0]?.url || splashItem?.Cover?.url || null;
        setSplashVideo(splashUrl);

        // ---------- Transform normal projects ----------
        const projectsFeed = allProjects
          .filter((p) => p.Slug !== "logo-video")
          .map((p) => {
            const description = Array.isArray(p.Description)
              ? p.Description.map((b) =>
                  b.children.map((c) => c.text).join("")
                ).join("\n")
              : "";

            const images = [
              ...(p.Cover?.url ? [p.Cover.url] : []),
              ...(p.Collection?.map((m) => m.url) || []),
            ];

            return {
              title: p.Title || "No Title",
              description: description || "",
              images,
              URL: p.URL || null,
            };
          });

        // ---------- Prepend bioItem to projectsFeed if it exists ----------
        const finalFeed = projectsFeed;

        // ---------- Set state ----------
        setFeedItems({
          bio: bioItem,
          projectsFeed: finalFeed,
        });
      } catch (err) {
        console.error("Error loading content:", err);
      }
    }

    loadContent();
  }, []);

  // ---------- Modal helpers ----------
  const openModal = (item, index = 0) => {
    if (!item.images?.length) return;
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

  // ---------- Render ----------
  return (
    <div className="app-wrapper">
      {showSplash ? (
        splashVideo ? (
          <Splash videoUrl={splashVideo} onFinish={() => setShowSplash(false)} />
        ) : (
          <div className="loading-screen">
            <span className="loading-wipe">Loading...</span>
          </div>
        )
      ) : (
        <>
          <Logo className="logo-fixed" />

          {feedItems.projectsFeed.length ? (
            <Feed
              bio={feedItems.bio} // can still pass separately if Feed wants it
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
        </>
      )}
    </div>
  );
}
