import axios from 'axios';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
export default function RateUser({ order }) {
  const seller = order.seller;
  const orderId = order._id;
  const [rateOk, setRateOk] = useState();
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState();
  const [description, setDescription] = useState('');
  const ticketData = {
    buyOrder: order,
    description,
    images,
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  const rateUser = async (isRated) => {
    await axios.put(`/api/user/${seller.name}`, {
      newRate: rating,
    });

    updateBuyOrder(isRated);
    setRateOk('');
  };
  const updateBuyOrder = async (isRated) => {
    await axios.put('/api/buyOrder', { orderId, isRated });
    setRateOk('');
  };

  const reportUser = async () => {
    setRateOk('');
    try {
      const res = await axios.post('/api/ticket', ticketData);
      if (res.status === 200) {
        alert('Ticket submitted successfully!');
        setDescription('');
      }
      updateBuyOrder('reported');
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };
  const fillColorArray = [
    '#cc4c4c', //czerwony
    '#cc7a33',
    '#d1a233',
    '#dbdb2a',
    '#a3d324', //zielony
  ];

  useEffect(() => {
    console.log(order);
  }, [order]);

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }

      await axios
        .post('/api/upload', data)
        .then((res) => setImages((prev) => [...prev, ...res.data.links]));

      setIsUploading(false);
    }
  }

  useEffect(() => {
    console.log(images);
  }, [images]);

  return (
    <>
      <div className="flex justify-center mb-4 bg-mainBg p-3 shadow-md">
        <div className="flex flex-col items-center text-white py-3 rounded-lg  w-full">
          {rateOk === undefined && order.rated === 'no' && (
            <div className="w-full max-w-md mx-auto bg-[#2a2a2a] rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01] border border-[#333333] text-center p-2">
              <p className="mb-4">Czy transakcja przebiegła pomyślnie?</p>
              <div className="flex gap-6 justify-center">
                <button
                  className="bg-brighterBg px-6 py-2 text-lg rounded-lg text-red-300 hover:opacity-60 border border-gray-700"
                  onClick={() => setRateOk(true)}
                >
                  Tak
                </button>
                <button
                  className="bg-red-300 text-white text-lg px-6 py-2 rounded hover:opacity-60 transition border border-red-200"
                  onClick={() => setRateOk(false)}
                >
                  Nie
                </button>
              </div>
            </div>
          )}
          {rateOk === true && order.rated === 'no' && (
            <>
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-mainBg text-red-300">
                <div className="absolute right-0 text-2xl p-6">
                  <button onClick={() => setRateOk()}>X</button>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="flex flex-col items-center p-6 gap-4">
                    {' '}
                    <div className="opacity-0 animate-fade-in animation-delay-400">
                      <div className="">
                        <p className="text-3xl mb-8">Oceń sprzedajacego</p>
                      </div>
                      {/* TODO wyswietlanie real avataru a nie static */}
                      <div className="justify-center flex">
                        <Image
                          src={
                            'https://cdn.tipo.live/files/avatar/48968_avatar.jpg?id=fa2f0c061cfb9c5000b18d2561baf330'
                          }
                          width={232}
                          height={232}
                          className="p-4 bg-brighterBg rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="opacity-0 animate-fade-in animation-delay-400 ">
                      <p className="">{seller.name}</p>
                    </div>
                    <div className="opacity-0 animate-fade-in animation-delay-800">
                      <p className="">
                        Średnia ocena tego użytkownika: {seller.userRating} / 5
                      </p>
                    </div>
                  </div>
                  <div className="mb-8 opacity-0 animate-fade-in animation-delay-800 items-center justify-center text-center">
                    <Rating
                      onClick={handleRating}
                      SVGclassName="inline"
                      fillColor={'red'}
                      size={50}
                      transition
                      showTooltip
                      fillColorArray={fillColorArray}
                      tooltipDefaultText="Ocena"
                      titleSeparator="z"
                    />
                  </div>
                  <div>
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={() => rateUser('yes')}
                        className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75 opacity-0 animate-fade-in animation-delay-1200"
                      >
                        Wystaw ocene
                      </button>
                      <button
                        onClick={() => updateBuyOrder('skipped')}
                        className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75 opacity-0 animate-fade-in animation-delay-1200"
                      >
                        Nie oceniaj
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {rateOk === false && order.rated === 'no' && (
            <>
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-mainBg text-red-300">
                <div className="absolute right-0 text-2xl p-6">
                  <button onClick={() => setRateOk()}>X</button>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="flex flex-col items-center p-6 gap-4">
                    {' '}
                    <div className="opacity-0 animate-fade-in animation-delay-400">
                      <div className="">
                        <p className="text-3xl mb-8">Zgłoś sprzedajacego</p>
                      </div>
                      {/* TODO wyswietlanie real avataru a nie static */}
                      <div className="justify-center flex">
                        <Image
                          src={
                            'https://cdn.tipo.live/files/avatar/48968_avatar.jpg?id=fa2f0c061cfb9c5000b18d2561baf330'
                          }
                          width={232}
                          height={232}
                          className="p-4 bg-brighterBg rounded-lg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="opacity-0 animate-fade-in animation-delay-400 ">
                      <p className="">{seller.name}</p>
                    </div>
                    <div className="opacity-0 animate-fade-in animation-delay-800 flex flex-col gap-2">
                      <label>Treść zgłoszenia</label>

                      <textarea
                        className="text-black p-2"
                        rows="4"
                        cols="50"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="opacity-0 animate-fade-in animation-delay-800">
                    <div className="flex flex-col items-center justify-center justify-items-center">
                      <p className="pb-3">załącz dowody (max 3 zdjecia)</p>
                      <div className="flex flex-row-reverse gap-6 ">
                        {images.length !== 3 && (
                          <label className="w-24 h-24 text-center flex-col flex items-center justify-center text-sm gap-1 text-primary rounded-lg bg-gray-200 cursor-pointer text-black shadow-sm border border-primary ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                              />
                            </svg>
                            <p className="">Dodaj obraz</p>
                            <input
                              type="file"
                              className="hidden"
                              disabled={images.length === 3}
                              onChange={uploadImages}
                            />
                          </label>
                        )}

                        <div className="flex gap-6 relative">
                          {images?.map((image, index) => (
                            <>
                              <button
                                key={index}
                                className="relative group   w-[96px]
                                    h-[96px]"
                                onClick={() =>
                                  setImages((prev) =>
                                    prev.filter((img) => img !== image)
                                  )
                                }
                              >
                                <Image
                                  src={image}
                                  fill
                                  alt="uploaded image cover "
                                  className="rounded-lg"
                                />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-200 text-7xl opacity-0 group-hover:opacity-100 transition">
                                  X
                                </div>
                              </button>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" mb-8 opacity-0 animate-fade-in animation-delay-800 items-center justify-center text-center"></div>
                  <div>
                    <div className="flex gap-4">
                      <button
                        onClick={reportUser}
                        className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75 opacity-0 animate-fade-in animation-delay-1200"
                      >
                        Wyślij zgłoszenie
                      </button>
                      <button
                        onClick={() => setRateOk()}
                        className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75 opacity-0 animate-fade-in animation-delay-1200"
                      >
                        Cofnij
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
