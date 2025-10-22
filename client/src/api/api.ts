const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiLogin(pin: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "PIN không đúng");
  return data;
}

export async function apiGetAccounts(token: string) {
  const res = await fetch(`${API_BASE}/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("TOKEN_EXPIRED");
  if (!res.ok) throw new Error(data.message || "Không lấy được dữ liệu");
  return data;
}

export async function apiCreateAccount(token: string, data: any) {
  const res = await fetch(`${API_BASE}/accounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("TOKEN_EXPIRED");
  if (!res.ok) throw new Error(json.message || "Không tạo được tài khoản");
  return json;
}

export async function apiUpdateAccount(token: string, id: string, data: any) {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("TOKEN_EXPIRED");
  if (!res.ok) throw new Error(json.message || "Không cập nhật được tài khoản");
  return json;
}

export async function apiDeleteAccount(token: string, id: string) {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("TOKEN_EXPIRED");
  if (!res.ok) throw new Error(json.message || "Không xóa được tài khoản");
  return json;
}

export async function apiChangePin(oldPin: string, newPin: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/auth/change-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ oldPin, newPin }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error("TOKEN_EXPIRED");
    throw new Error(data.message || "Không đổi được PIN");
  }
  return data;
}