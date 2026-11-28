const API_URL = "http://localhost:5000/api/workflows";

async function request(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Request failed"
        );
    }

    return data;
}

export async function saveWorkflow(name, nodes, edges) {
    return request(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            nodes,
            edges
        })
    });
}

export async function getWorkflows() {
    return request(API_URL);
}

export async function getWorkflow(id) {
    return request(`${API_URL}/${id}`);
}

export async function deleteWorkflow(id) {
    return request(`${API_URL}/${id}`, {
        method: "DELETE"
    });
}

export async function executeWorkflow(id) {
    return request(`${API_URL}/${id}/execute`, {
        method: "POST"
    });
}

export async function getHistory(id) {
    return request(`${API_URL}/${id}/history`);
}