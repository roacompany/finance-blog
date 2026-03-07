import type { Metadata } from 'next';
import AdminProviders from './components/AdminProviders';

export const metadata: Metadata = {
  title: 'Admin - 로아 블로그 관리자',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
      <AdminProviders>
        {children}
      </AdminProviders>
    </div>
  );
}
