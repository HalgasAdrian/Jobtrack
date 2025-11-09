const defaultHeaders = {
  "Content-Type": "application/json",
};

function authHeaders(token) {
  return token
    ? {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      }
    : defaultHeaders;
}

async function handleJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  async register(input) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(input),
    });
    return handleJsonResponse(res);
  },

  async login(input) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(input),
    });
    return handleJsonResponse(res);
  },

  async me(token) {
    const res = await fetch("/api/auth/me", {
      headers: authHeaders(token),
    });
    return handleJsonResponse(res);
  },

  profile: {
    async update(token, input) {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(input),
      });
      return handleJsonResponse(res);
    },
    async updatePassword(token, input) {
      const res = await fetch("/api/auth/me/password", {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(input),
      });
      return handleJsonResponse(res);
    },
  },

  applications: {
    async list(token) {
      const res = await fetch("/api/applications", {
        headers: authHeaders(token),
      });
      return handleJsonResponse(res);
    },
    async get(token, id) {
      const res = await fetch(`/api/applications/${id}`, {
        headers: authHeaders(token),
      });
      return handleJsonResponse(res);
    },
    async create(token, input) {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(input),
      });
      return handleJsonResponse(res);
    },
    async update(token, id, input) {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(input),
      });
      return handleJsonResponse(res);
    },
    async remove(token, id) {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });
      return handleJsonResponse(res);
    },
  },
};
