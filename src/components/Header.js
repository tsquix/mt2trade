import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Header({ noMb }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleChange = (e) => {
    const path = e.target.value;
    if (path) router.push(path);
  };
  return (
    <section
      className={`bg-brighterBg text-white  ${noMb ? '' : 'mb-12'} shadow-2xl`}
    >
      <div className="flex mx-auto max-w-7xl py-4 justify-between">
        <div className="flex gap-12">
          <div className="rounded-xl">
            <Link href={'/'}>Home</Link>
          </div>
          <div className="rounded-xl">
            <Link href={'/marketplace/offers'}>Marketplace</Link>
          </div>

          <div className="rounded-xl">
            <Link href={'/orders'}>
              <span className="">Zamowienia</span>
            </Link>
          </div>
        </div>

        <div className="">
          {!session ? (
            <>
              <Link href={'/login'}>
                <span className="px-6">Login</span>
              </Link>

              <Link href={'/sign-up'}>
                <span className="px-6">Signup</span>
              </Link>
            </>
          ) : (
            <>
              <div className="flex gap-8 items-center">
                <div className="text-xs rounded-xl">
                  <select
                    onChange={handleChange}
                    className="bg-gray-800 text-white p-2 rounded"
                  >
                    <option value="">Select</option>
                    <option value="/panel/create">Add new Server</option>
                    <option value="/panel/ticket">Ticket</option>
                  </select>
                </div>
                <Link href={'/profile'}>
                  <p className="rounded-xl">Profil</p>
                </Link>
                <button onClick={() => signOut()} className="rounded-xl">
                  Wyloguj
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
