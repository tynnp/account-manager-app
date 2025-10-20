import { useState } from 'react';
import { Plus, Search, LogOut, Key, Shield } from 'lucide-react';
import { Account } from '../types';
import AccountList from './AccountList';
import AccountModal from './AccountModal';
import ChangePinModal from './ChangePinModal';

interface MainScreenProps {
  accounts: Account[];
  onAddAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateAccount: (id: string, account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteAccount: (id: string) => void;
  onLogout: () => void;
  onChangePin: (oldPin: string, newPin: string) => void;
  currentPin: string;
}

export default function MainScreen({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onLogout,
  onChangePin,
  currentPin
}: MainScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAccountModalOpen(false);
    setSelectedAccount(undefined);
  };

  const handleSaveAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedAccount) {
      onUpdateAccount(selectedAccount.id, accountData);
    } else {
      onAddAccount(accountData);
    }
  };

  const handleDeleteAccount = () => {
    if (selectedAccount) {
      onDeleteAccount(selectedAccount.id);
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm border-b border-slate-200">
       <div className="max-w-8xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Quản Lý Tài Khoản</h1>
                <p className="text-xs text-slate-500">{accounts.length} tài khoản</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChangePinModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Đổi PIN</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài khoản..."
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            onClick={() => {
              setSelectedAccount(undefined);
              setIsAccountModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/30"
          >
            <Plus className="w-5 h-5" />
            Thêm tài khoản
          </button>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
              <Shield className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {searchQuery ? 'Không tìm thấy tài khoản' : 'Chưa có tài khoản nào'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu thêm tài khoản đầu tiên của bạn'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  setSelectedAccount(undefined);
                  setIsAccountModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/30"
              >
                <Plus className="w-5 h-5" />
                Thêm tài khoản đầu tiên
              </button>
            )}
          </div>
        ) : (
          <AccountList accounts={filteredAccounts} onSelectAccount={handleSelectAccount} />
        )}
      </div>

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAccount}
        onDelete={selectedAccount ? handleDeleteAccount : undefined}
        account={selectedAccount}
      />

      <ChangePinModal
        isOpen={isChangePinModalOpen}
        onClose={() => setIsChangePinModalOpen(false)}
        onSave={onChangePin}
        currentPin={currentPin}
      />
    </div>
  );
}
