import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface PinScreenProps {
  onSuccess: () => void;
  correctPin: string;
}

export default function PinScreen({ onSuccess, correctPin }: PinScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');

      if (newPin.length === 6) {
        setTimeout(() => {
          if (newPin === correctPin) {
            onSuccess();
          } else {
            setError('Mã PIN không đúng');
            setIsShaking(true);
            setTimeout(() => {
              setPin('');
              setIsShaking(false);
            }, 500);
          }
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-6 shadow-2xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Tài Khoản</h1>
          <p className="text-slate-400">Nhập mã PIN để tiếp tục</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className={`flex justify-center gap-3 mb-8 ${isShaking ? 'animate-shake' : ''}`}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  i < pin.length
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-400 shadow-lg shadow-emerald-500/50'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                {i < pin.length && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-16 bg-slate-700 hover:bg-slate-600 text-white text-2xl font-semibold rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="h-16 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-xl transition-all active:scale-95 shadow-lg"
            >
              Xóa hết
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 bg-slate-700 hover:bg-slate-600 text-white text-2xl font-semibold rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-16 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-xl transition-all active:scale-95 shadow-lg"
            >
              Xóa
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Mã PIN mặc định: 123456
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
