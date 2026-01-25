import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminNav({ children }) {
  const router = useRouter();

  const navItems = [
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/create', label: 'Create', icon: '➕' },
    { href: '/admin/ticket', label: 'Tickets', icon: '🎫' },
    { href: '/admin/messages', label: 'Messages', icon: '💬' },
    { href: '/admin/dcoffers', label: 'DC Offers', icon: '🎁' },
    { href: '/admin/servers', label: 'Servers', icon: '🖥️' },
    { href: '/admin/dcusers', label: 'DC Users', icon: '👤' },
  ];

  const isActive = (path) => router.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkerBg to-brighterBg">
      <div className="flex h-screen">
        <aside className="w-64 bg-bgMain shadow-xl flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <Link
              href="/"
              className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                width="32px"
                height="32px"
                viewBox="0 -64 640 640"
                className="flex-shrink-0"
              >
                <path d="M18.32 255.78L192 223.96l-91.28 68.69c-10.08 10.08-2.94 27.31 11.31 27.31h222.7c-9.44-26.4-14.73-54.47-14.73-83.38v-42.27l-119.73-87.6c-23.82-15.88-55.29-14.01-77.06 4.59L5.81 227.64c-12.38 10.33-3.45 30.42 12.51 28.14zm556.87 34.1l-100.66-50.31A47.992 47.992 0 0 1 448 196.65v-36.69h64l28.09 22.63c6 6 14.14 9.37 22.63 9.37h30.97a32 32 0 0 0 28.62-17.69l14.31-28.62a32.005 32.005 0 0 0-3.02-33.51l-74.53-99.38C553.02 4.7 543.54 0 533.47 0H296.02c-7.13 0-10.7 8.57-5.66 13.61L352 63.96 292.42 88.8c-5.9 2.95-5.9 11.36 0 14.31L352 127.96v108.62c0 72.08 36.03 139.39 96 179.38-195.59 6.81-344.56 41.01-434.1 60.91C5.78 478.67 0 485.88 0 494.2 0 504 7.95 512 17.76 512h499.08c63.29.01 119.61-47.56 122.99-110.76 2.52-47.28-22.73-90.4-64.64-111.36zM489.18 66.25l45.65 11.41c-2.75 10.91-12.47 18.89-24.13 18.26-12.96-.71-25.85-12.53-21.52-29.67z" />
              </svg>
            </Link>
            <Link
              href="/admin"
              className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                isActive('/admin')
                  ? 'bg-red-400 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              📊 Dashboard
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-red-400 text-white shadow-md transform scale-105'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 text-center">Admin Panel</div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return requireAdminAuth(context);
}
