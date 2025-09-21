import { BASE_API_URL } from "../constants";

const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (response.status !== 200) {
      throw new Error("Invalid email or password");
    }
    return Promise.resolve();
  },

  logout: async () => {
    await fetch(`${BASE_API_URL}/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  checkAuth: async () => {
    const response = await fetch(`${BASE_API_URL}/admin/me`, {
      credentials: "include",
    });
    if (response.status === 200) return Promise.resolve();
    return Promise.reject();
  },

  checkError: (error: any) => {
    if (error.status === 401 || error.status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => Promise.resolve(),
};

export default authProvider;
