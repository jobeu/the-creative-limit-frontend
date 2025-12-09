// api/getSplashVideo.js

export default async function handler(req, res) {
  const STRAPI_URL = process.env.STRAPI_API_URL;
  const STRAPI_KEY = process.env.STRAPI_API_KEY;

  if (!STRAPI_URL || !STRAPI_KEY) {
    console.error("getSplashVideo: Missing STRAPI_API_URL or STRAPI_API_KEY");
    return res.status(500).json({ error: "Missing STRAPI_API_URL or STRAPI_API_KEY" });
  }

  const headers = { Authorization: `Bearer ${STRAPI_KEY}` };

  try {
    // Fetch the Splash-video asset from the Assets collection
    const splashRes = await fetch(
      `${STRAPI_URL}/api/assets?filters[Title][$eq]=Splash-video&populate=*`,
      { headers }
    );

    if (!splashRes.ok) {
      const text = await splashRes.text().catch(() => "");
      console.error(
        "getSplashVideo: Strapi responded with non-OK:",
        splashRes.status,
        text
      );
      return res.status(502).json({ error: "Failed to fetch splash video from Strapi" });
    }

    // Parse JSON
    const splashJson = await splashRes.json();

    // Extract the splash video object
    const splashRaw = splashJson?.data?.[0] || null;

    if (!splashRaw) {
      return res.status(200).json({ splash: null });
    }

    // Normalize the shape like getBioPost.js does
    const splashItem = {
      Title: splashRaw.Title || null,
      Cover: splashRaw.Cover || null, // this contains the video file
    };

    return res.status(200).json({ splash: splashItem });
  } catch (err) {
    console.error("getSplashVideo error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
