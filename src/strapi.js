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

// Fetch the Splash video asset via serverless function
export const getSplashVideo = async () => {
  try {
    const response = await fetch("/api/getSplashVideo");
    const data = await response.json();

    if (!data || !data.splash) return null;

    return {
      Title: data.splash.Title || null,
      Cover: data.splash.Cover || null, // contains video file relationship
    };
  } catch (error) {
    console.error("strapi.js ERROR - fetching splash video:", error);
    return null;
  }
};

// Fetch the logo video asset
export const getLogoAsset = async () => {
  try {
    const response = await fetch("/api/getLogo");
    const data = await response.json();

    if (!data || !data.logo) return null;

    return {
      Title: data.logo.Title || null,
      Cover: data.logo.Cover || null,
    };
  } catch (error) {
    console.error("strapi.js ERROR - fetching logo:", error);
    return null;
  }
};
