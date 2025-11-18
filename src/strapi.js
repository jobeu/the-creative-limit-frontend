// strapi.js

// Fetch all projects via serverless function
export const getProjects = async () => {
  try {
    const response = await fetch("/api/getProjects");
    const data = await response.json();

    // Return projects array
    return data.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Fetch the Bio post from the serverless function
export const getBioPost = async () => {
  try {
    const response = await fetch("/api/getProjects"); // same endpoint
    const data = await response.json();

    // Bio post is in data.bio
    if (!data.bio) return null;

    const bioItem = {
      Title: data.bio.Title,
      Description: data.bio.Description,
      CoverImage: data.bio.CoverImage,
    };

    return bioItem;
  } catch (error) {
    console.error("Error fetching bio post:", error);
    return null;
  }
};
