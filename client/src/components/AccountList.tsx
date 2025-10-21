import { Account } from '../types';
import { Building2, Mail, Users, Briefcase, FolderOpen, Edit2 } from 'lucide-react';

interface AccountListProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
}

export default function AccountList({ accounts, onSelectAccount }: AccountListProps) {
  const getCategoryIcon = (category: Account['category']) => {
    switch (category) {
      case 'banking':
        return <Building2 className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <FolderOpen className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: Account['category']) => {
    switch (category) {
      case 'banking':
        return 'bg-blue-500';
      case 'email':
        return 'bg-red-500';
      case 'social':
        return 'bg-purple-500';
      case 'work':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Nếu chưa có tài khoản nào
  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center text-slate-500 p-8 border border-slate-200 rounded-lg bg-white">
        Chưa có tài khoản nào được thêm
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {accounts.map((account) => (
        <div
          key={account._id}
          onClick={() => onSelectAccount(account)}
          className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-300 transition-all cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div
              className={`${getCategoryColor(account.category)} p-2 rounded-lg text-white flex-shrink-0`}
            >
              {getCategoryIcon(account.category)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 truncate">{account.name}</h3>
              <p className="text-sm text-slate-500 truncate">{account.username}</p>
              <p className="text-xs text-slate-400 mt-1">
                {account.passwords?.length || 0} mật khẩu
              </p>
              <div className="text-[14px] text-slate-400 mt-1 space-y-0.5">
                {account.createdAt && (
                  <div>Ngày tạo: {new Date(account.createdAt).toLocaleString()}</div>
                )}
                {account.updatedAt && (
                  <div>Ngày cập nhật: {new Date(account.updatedAt).toLocaleString()}</div>
                )}
              </div>
            </div>
            <Edit2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
