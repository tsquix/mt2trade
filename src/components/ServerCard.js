import Image from 'next/image';
import Link from 'next/link';

export default function ServerCard({ server }) {
  return (
    <Link
      key={server._id}
      href={`/marketplace/offers/${server.slug}`}
      className="hover:opacity-80 transition-all h-[172px] w-[308px] relative block"
    >
      <Image
        src={server.img}
        fill
        alt={server.name}
        className="rounded-lg object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4 rounded-lg">
        <h3 className="text-white font-bold text-xl">{server.name}</h3>
      </div>
    </Link>
  );
}
