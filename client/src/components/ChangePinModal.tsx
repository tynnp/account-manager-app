import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (oldPin: string, newPin: string) => Promise<void>;
}

export default function ChangePinModal({ isOpen, onClose, onSave }: ChangePinModalProps) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPin.length !== 6) return setError('Mã PIN mới phải có 6 chữ số');
    if (newPin !== confirmPin) return setError('Mã PIN xác nhận không khớp');
    if (newPin === oldPin) return setError('Mã PIN mới phải khác mã PIN hiện tại');

    try {
      setLoading(true);
      await onSave(oldPin, newPin);
      handleClose();
    } catch (err) {
      console.error(err);
      setError('Không thể đổi mã PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Đổi mã PIN</h2>
          <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mã PIN hiện tại</label>
              <input
                type="password"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none font-mono text-lg tracking-widest"
                placeholder="••••••"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mã PIN mới (6 chữ số)</label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none font-mono text-lg tracking-widest"
                placeholder="••••••"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Xác nhận mã PIN mới</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none font-mono text-lg tracking-widest"
                placeholder="••••••"
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/30 disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : 'Đổi PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
