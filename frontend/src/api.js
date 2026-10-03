const TASKS_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/tasks/";


async function request(url = TASKS_URL, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    let message = "Something went wrong.";
    try {
      const data = await response.json();
      message = Object.values(data).flat().join(" ") || message;
    } catch {
      // Keep the short default message when the server sends no JSON.
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export function getTasks() {
  return request();
}

export function createTask(task) {
  return request(TASKS_URL, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, task) {
  return request(`${TASKS_URL}${id}/`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function toggleTask(id) {
  return request(`${TASKS_URL}${id}/`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export function deleteTask(id) {
  return request(`${TASKS_URL}${id}/`, { method: "DELETE" });
}

