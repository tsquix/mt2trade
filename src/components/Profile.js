import Image from 'next/image';

export default function Profile({ userData }) {
  //TODO make it seperate component
  const createdAt = userData?.createdAt;
  const date = new Date(createdAt);
  const monthYear = date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
  });
  return (
    <div className="flex-col">
      <div className="bg-brighterBg p-6 sm:p-12 shadow-2xl flex lg:flex-row flex-col">
        <div className="lg:w-1/3 lg:border-r lg:border-gray-700 md:pr-6">
          {' '}
          <div className="flex flex-col gap-16 ">
            <div className="">
              {' '}
              <div className="mb-4 flex lg:justify-start justify-center">
                <Image
                  src={
                    'https://cdn.tipo.live/files/avatar/48968_avatar.jpg?id=fa2f0c061cfb9c5000b18d2561baf330'
                  }
                  width={232}
                  height={232}
                  className="border border-red-300 rounded-lg"
                  alt="user avatar"
                  priority
                />
              </div>
              <div className="">
                <div className="flex items-center justify-center lg:justify-start mb-1">
                  <h2 className="text-2xl font-bold text-white mr-2">
                    {userData?.name}
                  </h2>
                  <span className="bg-gray-700 text-accent text-xs px-2 py-1 rounded">
                    {userData?.verified && (
                      <p className="flex gap-2">
                        certified
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#fca5a5"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                          />
                        </svg>
                      </p>
                    )}
                    {userData?.verified !== true && (
                      <p className="flex gap-2 ">
                        non certified
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#fca5a5"
                          className="size-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </p>
                    )}
                  </span>
                </div>

                <div className="mb-4 lg:justify-start justify-center flex">
                  <span className="text-sm text-gray-300">
                    Member since {monthYear}
                  </span>
                </div>
              </div>
              <div className="justify-center flex">
                <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 mb-4 w-full max-w-xs ">
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="#93c5fd"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.8943 4.34399C17.5183 3.71467 16.057 3.256 14.5317 3C14.3396 3.33067 14.1263 3.77866 13.977 4.13067C12.3546 3.89599 10.7439 3.89599 9.14391 4.13067C8.99457 3.77866 8.77056 3.33067 8.58922 3C7.05325 3.256 5.59191 3.71467 4.22552 4.34399C1.46286 8.41865 0.716188 12.3973 1.08952 16.3226C2.92418 17.6559 4.69486 18.4666 6.4346 19C6.86126 18.424 7.24527 17.8053 7.57594 17.1546C6.9466 16.92 6.34927 16.632 5.77327 16.2906C5.9226 16.184 6.07194 16.0667 6.21061 15.9493C9.68793 17.5387 13.4543 17.5387 16.889 15.9493C17.0383 16.0667 17.177 16.184 17.3263 16.2906C16.7503 16.632 16.153 16.92 15.5236 17.1546C15.8543 17.8053 16.2383 18.424 16.665 19C18.4036 18.4666 20.185 17.6559 22.01 16.3226C22.4687 11.7787 21.2836 7.83202 18.8943 4.34399ZM8.05593 13.9013C7.01058 13.9013 6.15725 12.952 6.15725 11.7893C6.15725 10.6267 6.98925 9.67731 8.05593 9.67731C9.11191 9.67731 9.97588 10.6267 9.95454 11.7893C9.95454 12.952 9.11191 13.9013 8.05593 13.9013ZM15.065 13.9013C14.0196 13.9013 13.1652 12.952 13.1652 11.7893C13.1652 10.6267 13.9983 9.67731 15.065 9.67731C16.121 9.67731 16.985 10.6267 16.9636 11.7893C16.9636 12.952 16.1317 13.9013 15.065 13.9013Z"
                      stroke="#000000"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-300">DragonSlayer#1337</span>
                  <button className="ml-auto text-gray-400 hover:text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#93c5fd"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/3 md:pl-6 lg:border-l border-gray-700 ">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              Reputation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-mainBg rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex"></div>
                </div>
                <div className="text-3xl font-bold text-white">
                  4.7{' '}
                  <span className="text-sm text-gray-400 font-normal">
                    /5.0
                  </span>
                </div>
              </div>

              <div className="bg-mainBg rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Ilość opinii</span>
                </div>
                <div className="text-3xl font-bold text-white">126</div>
              </div>
            </div>

            <div className="bg-mainBg rounded-lg p-4 space-y-1">
              {[
                { star: '5★', percent: 70 },
                { star: '4★', percent: 20 },
                { star: '3★', percent: 5 },
                { star: '2★', percent: 3 },
                { star: '1★', percent: 2 },
              ].map(({ star, percent }) => (
                <div key={star} className="flex items-center justify-between">
                  <div className="flex items-center w-full">
                    <span className="text-xs w-6">{star}</span>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 ml-2">
                      <div
                        className={`bg-red-300 h-2.5 rounded-full`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-mainBg rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">Trades</div>
                <div className="text-2xl font-bold text-white">247</div>
              </div>

              <div className="bg-mainBg rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">Yang Sold</div>
                <div className="text-2xl font-bold text-white">1.2B</div>
              </div>

              <div className="bg-mainBg rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">Response</div>
                <div className="text-2xl font-bold text-white">~12m</div>
              </div>

              <div className="bg-mainBg rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">Trusted By</div>
                <div className="text-2xl font-bold text-white">189</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 p-6 bg-brighterBg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          Recent Activity
        </h3>

        <div className="space-y-4">
          <div className="bg-mainBg rounded-lg p-3 flex items-center">
            <div className="bg-green-900 bg-opacity-30 text-green-400 p-2 rounded-lg mr-3"></div>
            <div>
              <div className="font-medium">Sold 500M Yang</div>
              <div className="text-gray-400 text-sm">2 hours ago</div>
            </div>
          </div>

          <div className="bg-mainBg rounded-lg p-3 flex items-center">
            <div className="bg-blue-900 bg-opacity-30 text-blue-400 p-2 rounded-lg mr-3"></div>
            <div>
              <div className="font-medium">Received 5-star review</div>
              <div className="text-gray-400 text-sm">Yesterday</div>
            </div>
          </div>

          <div className="bg-mainBg rounded-lg p-3 flex items-center">
            <div className="bg-green-900 bg-opacity-30 text-green-400 p-2 rounded-lg mr-3"></div>
            <div>
              <div className="font-medium">Sold 300M Yang</div>
              <div className="text-gray-400 text-sm">3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
