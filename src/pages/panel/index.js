import Link from 'next/link';
import Layout from '../layout';

export default function AdminPanel() {
  return (
    <Layout>
      <div>
        <Link href="/panel/create" className="bg-white text-black">
          dodaj serwer
        </Link>
      </div>
    </Layout>
  );
}
