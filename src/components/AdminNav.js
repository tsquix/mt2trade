import Link from 'next/link';

export default function AdminNav({ children }) {
  return (
    <div>
      <div className="flex w-full text-black h-full">
        <div className="grid grid-cols-[.15fr_.85fr] w-full">
          <div className="bg-red-300 flex h-[1024px] p-8 flex-col text-center gap-6">
            <div className="mb-8">
              <Link href={'/admin/'} className="">
                Home
              </Link>
            </div>
            <div className="bg-green-100 rounded-lg">
              <Link href={'/admin/users'} className="">
                {' '}
                users{' '}
              </Link>
            </div>
            <div className="bg-green-100 rounded-lg">
              <Link href={'/admin/create'} className="">
                {' '}
                create{' '}
              </Link>
            </div>
            <div className="bg-green-100 rounded-lg">
              <Link href={'/admin/ticket'} className="">
                {' '}
                tickets{' '}
              </Link>
            </div>
            <div className="bg-green-100 rounded-lg">
              <Link href={'/admin/messages'} className="">
                {' '}
                messages{' '}
              </Link>
            </div>
            <div className="bg-green-100 rounded-lg"></div>
          </div>
          <div className="bg-blue-300 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  return requireAdminAuth(context);
}
