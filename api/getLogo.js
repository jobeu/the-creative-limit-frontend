// api/getLogo.js

export default async function handler(req, res) {
  const STRAPI_URL = process.env.STRAPI_API_URL;
  const STRAPI_KEY = process.env.STRAPI_API_KEY;

  if (!STRAPI_URL || !STRAPI_KEY) {
    console.error("getLogo: Missing STRAPI_API_URL or STRAPI_API_KEY");
    return res.status(500).json({ error: "Missing STRAPI_API_URL or STRAPI_API_KEY" });
  }

  const headers = { Authorization: `Bearer ${STRAPI_KEY}` };

  try {
    // Fetch the Logo asset from the Assets collection
    const logoRes = await fetch(
      `${STRAPI_URL}/api/assets?filters[Title][$eq]=Logo&populate=*`,
      { headers }
    );

    if (!logoRes.ok) {
      const text = await logoRes.text().catch(() => "");
      console.error("getLogo: Strapi responded with non-OK:", logoRes.status, text);
      return res.status(502).json({ error: "Failed to fetch logo from Strapi" });
    }

    const logoJson = await logoRes.json();
    const logoRaw = logoJson?.data?.[0] || null;

    if (!logoRaw) {
      return res.status(200).json({ logo: null });
    }

    // Normalize to the shape the frontend expects
    const logoItem = {
      Title: logoRaw.Title || null,
      Cover: logoRaw.Cover || null, // keep the same structure as other asset endpoints
    };

    return res.status(200).json({ logo: logoItem });
  } catch (err) {
    console.error("getLogo error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
