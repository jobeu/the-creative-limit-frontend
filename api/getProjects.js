// api/getProjects.js

export default async function handler(req, res) {
  const STRAPI_URL = process.env.STRAPI_API_URL;
  const STRAPI_KEY = process.env.STRAPI_API_KEY;

  if (!STRAPI_URL || !STRAPI_KEY) {
    return res.status(500).json({ error: "Missing STRAPI_API_URL or STRAPI_API_KEY" });
  }

  try {
    // Fetch all projects only
    const projectsResponse = await fetch(
      `${STRAPI_URL}/api/projects?populate=*&sort=updatedAt:desc`,
      { headers: { Authorization: `Bearer ${STRAPI_KEY}` } }
    );
    const projectsData = await projectsResponse.json();

    // Return only projects
    res.status(200).json({
      data: projectsData.data || [],
    });
  } catch (error) {
    console.error("Error in getProjects:", error);
    res.status(500).json({ error: error.message });
  }
}
