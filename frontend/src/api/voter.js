import axios from "axios";

export const getVoters = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("http://localhost:5000/api/voters/getAll", {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching voters:", error.response?.data?.message);
    return [];
  }
};
