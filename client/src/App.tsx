import { useState, useEffect } from 'react';
import PinScreen from './components/PinScreen';
import MainScreen from './components/MainScreen';
import Toast from "./components/Toast";
import { Account } from './types';

// URL API backend
const API_BASE = import.meta.env.VITE_API_BASE

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Lấy danh sách account khi đăng nhập
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401) {
          handleLogout("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
          throw new Error("Token hết hạn hoặc không hợp lệ");
        }

        if (!res.ok) throw new Error('Không thể tải danh sách tài khoản');
        return res.json();
      })
      .then(data => setAccounts(data))
      .catch(err => {
        console.error(err);
        if (err.message !== "Token hết hạn hoặc không hợp lệ") {
          setToast({ message: "Không tải được danh sách tài khoản", type: "error" });
        }
      });
  }, [token]);

  // Sau khi đăng nhập
  const handlePinSuccess = (tokenValue: string) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
    setIsAuthenticated(true);
    setToast({ message: "Đăng nhập thành công", type: "success" });
  };

  // Đăng xuất
  const handleLogout = (msg?: string) => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
    if (msg) setToast({ message: msg, type: "error" });
  };

  // Thêm account
  const handleAddAccount = async (accountData: Omit<Account, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_BASE}/accounts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      if (res.status === 401) {
        handleLogout("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        return;
      }

      if (!res.ok) throw new Error('Không thêm được tài khoản');
      const newAcc = await res.json();
      setAccounts([...accounts, newAcc]);
      setToast({ message: "Thêm tài khoản thành công", type: "success" });
    } catch (err) {
      setToast({ message: "Lỗi khi thêm tài khoản", type: "error" });
      console.error(err);
    }
  };

  // Cập nhật account
  const handleUpdateAccount = async (id: string, accountData: Omit<Account, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_BASE}/accounts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      if (res.status === 401) {
        handleLogout("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        return;
      }

      if (!res.ok) throw new Error('Không cập nhật được tài khoản');
      const updated = await res.json();
      setAccounts(accounts.map(a => (a._id === id ? updated : a)));
      setToast({ message: "Cập nhật tài khoản thành công", type: "success" });
    } catch (err) {
      setToast({ message: "Lỗi khi cập nhật tài khoản", type: "error" });
      console.error(err);
    }
  };

  // Xóa account
  const handleDeleteAccount = async (id: string) => {
    const res = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      handleLogout("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast({ message: data.message || "Không xóa được tài khoản", type: "error" });
      throw new Error(data.message || "Không xóa được tài khoản");
    }

    setAccounts(accounts.filter(a => a._id !== id));
    setToast({ message: "Xóa tài khoản thành công", type: "success" });
  };

  // Đổi PIN
  const handleChangePin = async (oldPin: string, newPin: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/change-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPin, newPin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.message || "Lỗi khi đổi mã PIN", type: "error" });
        return;
      }

      setToast({ message: data.message || "Đổi mã PIN thành công", type: "success" });
    } catch (err) {
      setToast({ message: "Không thể kết nối tới server", type: "error" });
      console.error(err);
    }
  };

  // Hiển thị
  if (!isAuthenticated) {
    return <PinScreen onSuccess={handlePinSuccess} />;
  }

  return (
    <>
      <MainScreen
        accounts={accounts}
        onAddAccount={handleAddAccount}
        onUpdateAccount={handleUpdateAccount}
        onDeleteAccount={handleDeleteAccount}
        onLogout={handleLogout}
        onChangePin={handleChangePin}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default App;
