import { Account } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Vietcombank',
    username: '0123456789',
    category: 'banking',
    passwords: [
      { id: 'p1', label: 'Mật khẩu đăng nhập', value: 'VCB@2024secure' },
      { id: 'p2', label: 'Mật khẩu giao dịch', value: '123456' },
      { id: 'p3', label: 'Passcode', value: '999888' }
    ],
    note: 'Tài khoản chính',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Gmail',
    username: 'myemail@gmail.com',
    category: 'email',
    passwords: [
      { id: 'p4', label: 'Mật khẩu', value: 'Gmail@Strong123' }
    ],
    note: 'Email cá nhân',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Facebook',
    username: 'user@facebook.com',
    category: 'social',
    passwords: [
      { id: 'p5', label: 'Mật khẩu', value: 'Fb#Secure2024' }
    ],
    note: 'Mạng xã hội',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '4',
    name: 'Techcombank',
    username: '9876543210',
    category: 'banking',
    passwords: [
      { id: 'p6', label: 'Mật khẩu đăng nhập', value: 'TCB@2024pass' },
      { id: 'p7', label: 'Smart OTP', value: '456789' }
    ],
    note: 'Tài khoản phụ',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '5',
    name: 'LinkedIn',
    username: 'professional@linkedin.com',
    category: 'work',
    passwords: [
      { id: 'p8', label: 'Mật khẩu', value: 'Work@LinkedIn99' }
    ],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
];

export const DEFAULT_PIN = '123456';
