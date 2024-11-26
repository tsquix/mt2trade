import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <section className="bg-slate-200 shadow-lg">
      <div className="flex mx-auto max-w-7xl py-6 justify-between">
        <div className="">
          <Link href={"/"}>
            <span className="px-6">Home</span>
          </Link>
          <Link href={"/huj"}>
            <span className="px-6">huj</span>
          </Link>
        </div>

        <div className="">
          {!session ? (
            <>
              <Link href={"/login"}>
                <span className="px-6">Login</span>
              </Link>
              <Link href={"/sign-up"}>
                <span className="px-6">Signup</span>
              </Link>
            </>
          ) : (
            <>
              <span className="px-6">Welcome, {session.user.name}</span>
              <button onClick={() => signOut()} className="px-6">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
