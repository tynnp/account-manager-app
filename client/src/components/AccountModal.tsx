import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Building2, Mail, Users, Briefcase, FolderOpen } from 'lucide-react';
import { Account, Password } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<Account, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
  account?: Account;
}

export default function AccountModal({ isOpen, onClose, onSave, onDelete, account }: AccountModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState<Account['category']>('other');
  const [passwords, setPasswords] = useState<Password[]>([
    { _id: crypto.randomUUID(), label: 'Mật khẩu', value: '' },
  ]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (account) {
      setName(account.name);
      setUsername(account.username);
      setCategory(account.category);
      setPasswords(account.passwords || []);
      setNote(account.note || '');
    } else {
      setName('');
      setUsername('');
      setCategory('other');
      setPasswords([{ _id: crypto.randomUUID(), label: 'Mật khẩu', value: '' }]);
      setNote('');
    }
  }, [account, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      username,
      category,
      passwords: passwords.map(p => ({
        _id: p._id,
        label: p.label,
        value: p.value,
      })),
      note,
    });
    onClose();
  };

  const addPassword = () => {
    setPasswords([
      ...passwords,
      { _id: crypto.randomUUID(), label: '', value: '' },
    ]);
  };

  const removePassword = (id?: string) => {
    if (passwords.length > 1) {
      setPasswords(passwords.filter(p => p._id !== id));
    }
  };

  const updatePassword = (id: string, field: 'label' | 'value', value: string) => {
    setPasswords(passwords.map(p => (p._id === id ? { ...p, [field]: value } : p)));
  };

  const categories = [
    { value: 'banking', label: 'Ngân hàng', icon: Building2 },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'social', label: 'Mạng xã hội', icon: Users },
    { value: 'work', label: 'Công việc', icon: Briefcase },
    { value: 'other', label: 'Khác', icon: FolderOpen },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {account ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-5">
            {/* Tên tài khoản */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tên tài khoản</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="VD: Vietcombank, Gmail..."
                required
              />
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tên đăng nhập/Số tài khoản</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="VD: 0123456789, user@email.com..."
                required
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value as Account['category'])}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${category === cat.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    <span className="font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                <button
                  type="button"
                  onClick={addPassword}
                  className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm mật khẩu
                </button>
              </div>
              <div className="space-y-3">
                {passwords.map((password, index) => (
                  <div key={password._id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-600">
                        Mật khẩu {index + 1}
                      </span>
                      {passwords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassword(password._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={password.label}
                        onChange={(e) => updatePassword(password._id, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
                        placeholder="Nhãn (VD: Mật khẩu đăng nhập, Passcode...)"
                        required
                      />
                      <input
                        type="text"
                        value={password.value}
                        onChange={(e) => updatePassword(password._id, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm font-mono"
                        placeholder="Mật khẩu"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ghi chú (tùy chọn)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Thêm ghi chú..."
                rows={3}
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
            {account && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Xóa tài khoản
              </button>
            ) : (
              <div></div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/30"
              >
                {account ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
