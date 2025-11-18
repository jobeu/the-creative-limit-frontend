// api/getProjects.js

export default async function handler(req, res) {
  const STRAPI_URL = process.env.STRAPI_API_URL;
  const STRAPI_KEY = process.env.STRAPI_API_KEY;

  if (!STRAPI_URL || !STRAPI_KEY) {
    return res.status(500).json({ error: "Missing STRAPI_API_URL or STRAPI_API_KEY" });
  }

  try {
    // Fetch all projects
    const projectsResponse = await fetch(
      `${STRAPI_URL}/api/projects?populate=*&sort=updatedAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_KEY}`,
        },
      }
    );

    if (!projectsResponse.ok) {
      throw new Error(`Failed to fetch projects from Strapi: ${projectsResponse.status}`);
    }

    const projectsData = await projectsResponse.json();

    // Fetch blogposts to find the Bio post
    const blogResponse = await fetch(`${STRAPI_URL}/api/blogposts?populate=*`, {
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
    });

    if (!blogResponse.ok) {
      throw new Error(`Failed to fetch blogposts from Strapi: ${blogResponse.status}`);
    }

    const blogData = await blogResponse.json();
    const bioItemRaw = blogData.data.find(post => post.Title === "Bio") || null;

    const bioItem = bioItemRaw
      ? {
          Title: bioItemRaw.Title,
          Description: bioItemRaw.Content,
          CoverImage: bioItemRaw.Cover_image,
        }
      : null;

    // Return combined data
    res.status(200).json({
      data: projectsData.data || [],
      bio: bioItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
