const API_BASE = "http://localhost:8386/api";

export async function apiLogin(pin: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) throw new Error("PIN không đúng");
  return res.json(); 
}

export async function apiGetAccounts(token: string) {
  const res = await fetch(`${API_BASE}/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không lấy được dữ liệu");
  return res.json();
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
  if (!res.ok) throw new Error("Không tạo được tài khoản");
  return res.json();
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
  if (!res.ok) throw new Error("Không cập nhật được tài khoản");
  return res.json();
}

export async function apiDeleteAccount(token: string, id: string) {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không xóa được tài khoản");
  return res.json();
}

export async function apiChangePin(oldPin: string, newPin: string) {
  const res = await fetch(`${API_BASE}/auth/change-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPin, newPin }),
  });
  if (!res.ok) throw new Error("Không đổi được PIN");
  return res.json();
}
