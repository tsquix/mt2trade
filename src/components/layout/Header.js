import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Header({ noMb, fadeIn }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section
      className={`relative z-20 text-white ${noMb ? '' : 'pb-20'} ${fadeIn ? 'animate-fade-in-slow-rev' : ''} shadow-2xl  `}
    >
      <div className="absolute w-full">
        <div className="flex py-4 justify-between shadow-xl px-4 lg:px-12 ">
          <div className="flex gap-4 lg:gap-12 ">
            <div className="rounded-xl ">
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

          <div className="lg:block hidden">
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
                    <Link href={'/admin'}>Admin panel</Link>
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
      </div>
    </section>
  );
}
