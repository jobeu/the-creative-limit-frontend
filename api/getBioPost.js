// api/getBioPost.js

export default async function handler(req, res) {
  const STRAPI_URL = process.env.STRAPI_API_URL;
  const STRAPI_KEY = process.env.STRAPI_API_KEY;

  if (!STRAPI_URL || !STRAPI_KEY) {
    console.error("getBioPost: Missing STRAPI_API_URL or STRAPI_API_KEY");
    return res.status(500).json({ error: "Missing STRAPI_API_URL or STRAPI_API_KEY" });
  }

  const headers = { Authorization: `Bearer ${STRAPI_KEY}` };

  try {
    // Fetch the Bio asset from the Assets collection
    const bioRes = await fetch(
      `${STRAPI_URL}/api/assets?filters[Title][$eq]=Bio&populate=*`,
      { headers }
    );

    if (!bioRes.ok) {
      const text = await bioRes.text().catch(() => "");
      console.error("getBioPost: Strapi responded with non-OK:", bioRes.status, text);
      return res.status(502).json({ error: "Failed to fetch bio from Strapi" });
    }

    // Parse JSON
    const bioJson = await bioRes.json();

    // Extract the bio object directly from data[0]
    const bioRaw = bioJson?.data?.[0] || null;

    if (!bioRaw) {
      return res.status(200).json({ bio: null });
    }

    // Normalize to the shape the frontend expects
    const bioItem = {
      Title: bioRaw.Title || null,
      Display_Title: bioRaw.Display_Title || null,
      Text_Content: bioRaw.Text_Content || bioRaw.Content || null,
      Cover: bioRaw.Cover || null,
    };

    return res.status(200).json({ bio: bioItem });
  } catch (err) {
    console.error("getBioPost error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
