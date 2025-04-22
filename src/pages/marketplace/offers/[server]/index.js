import Layout from '@/pages/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OfferDetailPage from './[offer]';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OfferPage() {
  // const offers = [
  //   {
  //     name: 'Oferta 1',
  //     slug: 'oferta-1',
  //     tab: 'YANGI',
  //     title: 'Sprzedam yangaski',
  //     span: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium fuga voluptatum ipsum blanditiis iste incidunt a et? Animi consectetur, ex non hic impedit molestias maiores ab? Magni, animi. Asperiores, exercitationem.',
  //     username: 'debil', // Added username
  //     userrating: 4.5, // Added userrating
  //     currencyType: 'yang', // Added currencyType
  //     currencyAmount: 100, // Added currencyAmount
  //     pricePLN: 10, // Added pricePLN
  //   },
  //   {
  //     name: 'Oferta 2',
  //     slug: 'oferta-2',
  //     tab: 'WONY',
  //     title: 'Sprzedam wonasy',
  //     span: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium fuga voluptatum ipsum blanditiis iste incidunt a et? Animi consectetur, ex non hic impedit molestias maiores ab? Magni, animi. Asperiores, exercitationem.',
  //     username: 'debil', // Added username
  //     userrating: 4.1, // Added userrating
  //   },
  //   {
  //     name: 'Oferta 4',
  //     slug: 'oferta-4',
  //     tab: 'WONY',
  //     title: 'Sprzedam wonasy',
  //     span: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium fuga voluptatum ipsum blanditiis iste incidunt a et? Animi consectetur, ex non hic impedit molestias maiores ab? Magni, animi. Asperiores, exercitationem.',
  //     username: 'debil', // Added username
  //     userrating: 4.1, // Added userrating
  //   },
  //   {
  //     name: 'Oferta 3',
  //     slug: 'oferta-3',
  //     tab: 'WONY',
  //     title: 'Sprzedam wonasy',
  //     span: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium fuga voluptatum ipsum blanditiis iste incidunt a et? Animi consectetur, ex non hic impedit molestias maiores ab? Magni, animi. Asperiores, exercitationem.',
  //     username: 'debil', // Added username
  //     userrating: 4.1, // Added userrating
  //   },
  // ];

  const router = useRouter();
  const { server } = router.query;
  const [selectedOffer, setSelectedOffer] = useState(null); // State for selected offer
  const [offers, setOffers] = useState(null); // State for selected offer
  useEffect(() => {
    console.log(offers);
  }, [offers]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`/api/offer?server=${server}`);
        setOffers(response.data.offers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    if (server) {
      fetchOffers();
    }
  }, [server]);

  return (
    <Layout>
      <div className="flex justify-center text-center mb-12 flex-col">
        <h1 className="text-3xl font-bold">{server}</h1>
        <div className="flex justify-center">
          <Link href={`/marketplace/offers/create?server=${server}`}>
            <p className="text-3xl font-bold bg-mainBg hover:bg-white hover:text-black px-3 py-1 rounded-lg">
              utworz swoja oferte
            </p>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-16">
        <div className="flex flex-col gap-y-8 ">
          {' '}
          {offers?.map((offer) => (
            <button
              key={offer._id}
              className={` p-6 rounded-3xl block transition-all ${selectedOffer?.title === offer?.title ? 'opacity-50 bg-brighterBg' : 'bg-mainBg'}`}
              onClick={() => setSelectedOffer(offer)}
            >
              <div className="bg-mainBg p-6 rounded-3xl">
                <div className="flex gap-2 mb-3">
                  <div className="px-1 py-1 bg-brighterBg text-center w-16 rounded-3xl text-xs ">
                    {offer.tag !== '' ? 'Yang' : 'Wony'}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>{offer.title}</strong>
                </div>
                <div className="flex">
                  <div className="flex">
                    <div className="text-sm font-bold ">
                      <div className="flex items-center mb-2">
                        {offer.seller.userRating} {/* Display userrating */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="red"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                          />
                        </svg>
                        <span className="text-red-300 px-2">
                          {' '}
                          {offer.seller.name} {/* Display username */}
                        </span>
                      </div>
                      <span className="text-gray-300">{offer.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="sticky top-10 h-screen overflow-auto">
          {' '}
          {/* Ensure the parent has a height and overflow */}
          <div className="flex bg-mainBg  rounded-3xl">
            {selectedOffer && (
              <OfferDetailPage offers={offers} selectedOffer={selectedOffer} />
            )}{' '}
            {/* Pass selected offer */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
