const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function translateQuery(query, schemaKey = "college", dialect = "mysql") {
  const res = await fetch(`${API_BASE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, schema_key: schemaKey, dialect })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to translate query");
  }
  return res.json();
}

export async function executeQuery(sql, schemaKey) {
  const res = await fetch(`${API_BASE_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql, schema_key: schemaKey })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to execute query");
  }
  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${API_BASE_URL}/history`);
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}

export async function addHistory(englishQuery, sqlQuery, schemaName, dialect) {
  const res = await fetch(`${API_BASE_URL}/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      english_query: englishQuery,
      sql_query: sqlQuery,
      schema_name: schemaName,
      dialect
    })
  });
  if (!res.ok) throw new Error("Failed to save query to history");
  return res.json();
}

export async function toggleStarHistory(id) {
  const res = await fetch(`${API_BASE_URL}/history/${id}/star`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to toggle star");
  return res.json();
}

export async function deleteHistoryItem(id) {
  const res = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete history item");
  return true;
}

export async function clearHistory() {
  const res = await fetch(`${API_BASE_URL}/history`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to clear history");
  return true;
}
