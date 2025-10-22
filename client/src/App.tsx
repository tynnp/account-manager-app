import { useState, useEffect } from 'react';
import PinScreen from './components/PinScreen';
import MainScreen from './components/MainScreen';
import Toast from "./components/Toast";
import { Account } from './types';
import {
  apiGetAccounts,
  apiCreateAccount,
  apiUpdateAccount,
  apiDeleteAccount,
  apiChangePin,
} from './api/api';

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!token) return;

    // Giải mã token và tính thời gian còn lại
    const decoded = decodeToken(token);
    if (decoded && decoded.exp) {
      const expiresIn = decoded.exp * 1000 - Date.now();

      if (expiresIn <= 0) {
        handleLogout("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        return;
      }

      // Đặt hẹn giờ tự logout
      const timer = setTimeout(() => {
        handleLogout("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      }, expiresIn);

      return () => clearTimeout(timer);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    apiGetAccounts(token)
      .then(setAccounts)
      .catch(err => {
        console.error(err);
        if (err.message === "TOKEN_EXPIRED") {
          handleLogout("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        } else {
          setToast({ message: err.message || "Không tải được danh sách tài khoản", type: "error" });
        }
      });
  }, [token]);

  const handlePinSuccess = (tokenValue: string) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
    setIsAuthenticated(true);
    setToast({ message: "Đăng nhập thành công", type: "success" });
  };

  const handleLogout = (msg?: string) => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
    if (msg) setToast({ message: msg, type: "error" });
  };

  const handleAddAccount = async (accountData: Omit<Account, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAcc = await apiCreateAccount(token, accountData);
      setAccounts([...accounts, newAcc]);
      setToast({ message: "Thêm tài khoản thành công", type: "success" });
    } catch (err) {
      setToast({ message: "Lỗi khi thêm tài khoản", type: "error" });
    }
  };

  const handleUpdateAccount = async (id: string, data: any) => {
    try {
      const updated = await apiUpdateAccount(token, id, data);
      setAccounts(accounts.map(a => (a._id === id ? updated : a)));
      setToast({ message: "Cập nhật tài khoản thành công", type: "success" });
    } catch (err) {
      setToast({ message: "Lỗi khi cập nhật tài khoản", type: "error" });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await apiDeleteAccount(token, id);
      setAccounts(accounts.filter(a => a._id !== id));
      setToast({ message: "Xóa tài khoản thành công", type: "success" });
    } catch {
      setToast({ message: "Không xóa được tài khoản", type: "error" });
    }
  };

  const handleChangePin = async (oldPin: string, newPin: string) => {
    try {
      const res = await apiChangePin(oldPin, newPin);
      setToast({ message: res.message || "Đổi mã PIN thành công", type: "success" });
    } catch {
      setToast({ message: "Lỗi khi đổi mã PIN", type: "error" });
    }
  };

  if (!isAuthenticated) return <PinScreen onSuccess={handlePinSuccess} />;

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
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

export default App;
