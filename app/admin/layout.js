import './admin.css';

export const metadata = {
  title: 'Dashboard — Organik Greens',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="adm-root">{children}</div>;
}
