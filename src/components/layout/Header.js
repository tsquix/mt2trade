import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';

export default function Header({ noMb, fadeIn }) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  // handle repeated onboard
  const handleOnBoard = async () => {
    localStorage.removeItem('HAS_SEEN_TOUR');

    if (session) {
      axios
        .patch(`/api/user/me`, {
          hasSeenOnboarding: false,
        })
        .catch((err) => console.error(err));
    }

    const isOnOffersPage = pathname?.includes('/marketplace/offers');
    if (isOnOffersPage) {
      // wywolaj event samouczka
      window.dispatchEvent(new Event('start-onboarding'));
    } else {
      // przejdz na strone z samouczkiem ktory sie sam odpali
      router.push('/marketplace/offers/Tundria2');
    }
    setShowModal(false);
  };

  useEffect(() => {
    // handlee click
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    };

    // handle esc key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    // clean up function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal]);

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

            <div className="rounded-xl" data-tour="orders-link">
              <Link href={'/orders'}>
                <span className="">Zamowienia</span>
              </Link>
            </div>
          </div>

          <div className="lg:flex hidden">
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
                  <Link href={'/report'}>
                    <p className="rounded-xl text-xs">Report user</p>
                  </Link>
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
            <div className="px-8 relative flex justify-center ">
              <button
                ref={buttonRef}
                onClick={() => setShowModal(!showModal)}
                className="hover:opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 select-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
              </button>

              {showModal && (
                <>
                  <div ref={modalRef} className="absolute mt-10">
                    <div className="absolute inset-0 backdrop-blur-xl bg-black/80 rounded-b-xl"></div>
                    <div className="relative flex flex-col gap-2 p-4 rounded-lg">
                      <button
                        className="hover:opacity-75 border px-6 border-gray-500 rounded-md"
                        onClick={handleOnBoard}
                      >
                        Samouczek
                      </button>
                      <Link
                        className="hover:opacity-75 border px-6 border-gray-500 rounded-md"
                        href={'/faq'}
                      >
                        FAQ
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
