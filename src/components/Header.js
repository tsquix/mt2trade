import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleChange = (e) => {
    const path = e.target.value;
    if (path) router.push(path);
  };
  return (
    <section className="bg-mainBg shadow-lg text-white mb-12">
      <div className="flex mx-auto max-w-7xl py-6 justify-between">
        <div className="bg-brighterBg px-5 py-2 rounded-xl">
          <Link href={'/'}>Home</Link>
        </div>
        <div className="bg-brighterBg px-5 py-2 rounded-xl">
          <Link href={'/marketplace/offers'}>marketplace</Link>
        </div>

        <div className="bg-brighterBg px-5 py-2 rounded-xl">
          <Link href={'/orders'}>
            <span className="px-6">Zamowienia</span>
          </Link>
        </div>
        <div className="bg-brighterBg  text-xs py-2 rounded-xl">
          <select
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="">Select</option>
            <option value="/panel/create">Create Server</option>
            <option value="/panel/ticket">Ticket</option>
          </select>
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
              <div className="flex gap-6">
                <Link href={'/profile'}>
                  <p className="bg-brighterBg px-5 py-2 rounded-xl">
                    Welcome, {session.user.name}
                  </p>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-brighterBg px-5 py-2 rounded-xl"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
