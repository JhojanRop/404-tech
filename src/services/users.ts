import { api } from "@/lib/api";
import { getStoredToken } from "./auth";

const getUsers = async () => {
  const token = getStoredToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  return api.get("/users", {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

const getUserById = async (id: string) => {
  const token = getStoredToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  return api.get(`/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export { getUsers, getUserById };