import Link from 'next/link';
import { useRouter } from 'next/router';

export const EmptyOffersList = () => {
  const router = useRouter();
  const { server } = router.query;

  return (
    <div className="pt-8">
      <h2>Nie znaleźliśmy żadnej oferty dla tego serwera...</h2>
      <p className="mb-1">
        Bądź pierwszy i
        <Link
          href={`/marketplace/offers/create?server=${server}`}
          className="text-red-300 hover:text-red-400"
        >
          {' '}
          utwórz teraz
        </Link>
      </p>
    </div>
  );
};
