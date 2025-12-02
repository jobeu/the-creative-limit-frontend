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

// Fetch the Bio post via the dedicated serverless function
export const getBioPost = async () => {
  try {
    const response = await fetch("/api/getBioPost");
    const data = await response.json();

    if (!data || !data.bio) return null;

    return {
      Title: data.bio.Title || null,
      Display_Title: data.bio.Display_Title || null,
      Text_Content: data.bio.Text_Content || null,
      Cover: data.bio.Cover || null,
    };
  } catch (error) {
    console.error("strapi.js ERROR - fetching bio post:", error);
    return null;
  }
};
