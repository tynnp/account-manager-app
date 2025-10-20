import { useState, useEffect } from 'react';
import PinScreen from './components/PinScreen';
import MainScreen from './components/MainScreen';
import { Account } from './types';
import { MOCK_ACCOUNTS, DEFAULT_PIN } from './mockData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState(DEFAULT_PIN);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('accounts');
    const savedPin = localStorage.getItem('pin');

    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    } else {
      setAccounts(MOCK_ACCOUNTS);
      localStorage.setItem('accounts', JSON.stringify(MOCK_ACCOUNTS));
    }

    if (savedPin) {
      setPin(savedPin);
    }
  }, []);

  const handlePinSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAddAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  const handleUpdateAccount = (id: string, accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedAccounts = accounts.map(account =>
      account.id === id
        ? { ...account, ...accountData, updatedAt: new Date() }
        : account
    );
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  const handleDeleteAccount = (id: string) => {
    const updatedAccounts = accounts.filter(account => account.id !== id);
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  const handleChangePin = (oldPin: string, newPin: string) => {
    setPin(newPin);
    localStorage.setItem('pin', newPin);
  };

  if (!isAuthenticated) {
    return <PinScreen onSuccess={handlePinSuccess} correctPin={pin} />;
  }

  return (
    <MainScreen
      accounts={accounts}
      onAddAccount={handleAddAccount}
      onUpdateAccount={handleUpdateAccount}
      onDeleteAccount={handleDeleteAccount}
      onLogout={handleLogout}
      onChangePin={handleChangePin}
      currentPin={pin}
    />
  );
}

export default App;
