export const fetchSearchHistory = async (name, captchaToken, signal) => {
    const url = new URL(`${process.env.REACT_APP_BACKEND_URL}/api/search-history`);
    url.searchParams.append("name", name);
    if (!localStorage.getItem("captchaVerified") && process.env.NODE_ENV !== "development") {
      url.searchParams.append("captcha", captchaToken);
    }
  
    const response = await fetch(url, { signal });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Unknown error");
    }
    return response.json();
};
  
export const fetchBioData = async (name) => {
    try {
      const searchResponse = await fetch(
        `https://api.themoviedb.org/3/search/person?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(name)}`
      );
      const searchData = await searchResponse.json();
      const personId = searchData.results[0]?.id;
  
      if (!personId) {
        return {
          name,
          age: "Unknown",
          bio: "No biography available.",
          photo: "https://via.placeholder.com/150"
        };
      }
  
      const personResponse = await fetch(
        `https://api.themoviedb.org/3/person/${personId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const personData = await personResponse.json();
  
      const calculateAge = (birthday) => {
        if (!birthday) return "Unknown";
        const birthDate = new Date(birthday);
        const today = new Date("2025-03-22");
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };
  
      const truncateBio = (bio) => {
        if (!bio) return "No biography available.";
        const sentences = bio.split(/(?<=[.!?])\s+/);
        return sentences.slice(0, 3).join(" ") || "No biography available.";
      };
  
      return {
        name: personData.name,
        age: calculateAge(personData.birthday),
        bio: truncateBio(personData.biography),
        photo: personData.profile_path
          ? `https://image.tmdb.org/t/p/w200${personData.profile_path}`
          : "https://via.placeholder.com/150"
      };
    } catch (err) {
      console.error("TMDb Error:", err.message);
      return {
        name,
        age: "Unknown",
        bio: "No biography available.",
        photo: "https://via.placeholder.com/150"
      };
    }
};