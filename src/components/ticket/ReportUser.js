import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useFilterByRegex } from '../../../hooks/useFilterByRegex';
import img from '../../../public/profileImg.png';
export default function ReportUser({ seller, setRateOk, orderId }) {
  const router = useRouter();
  const { username } = router.query;
  const [description, setDescription] = useState('');
  //TODO loader na isuploadin
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [phrase, setPhrase] = useState('');
  const [userList, setUserList] = useState([]);
  const [debouncedPhrase, setDebouncedPhrase] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const onFocus = () => setFocused(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (username?.length > 0) {
          const res = await axios.get(`/api/user/${username}`);

          if (res.data.success) {
            setSelectedUser(res.data.user);
          } else {
            setError(res.data || 'User not found');
            console.log('Błąd:', res.data);
          }
        } else {
          const res = await axios.get('/api/user');
          setUserList(res.data.users);
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || 'Unknown error');
        } else {
          setError('Network error');
        }
      }
    };

    fetchUsers();
  }, [username]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhrase(phrase);
    }, 300);

    return () => clearTimeout(handler);
  }, [phrase]);

  const filteredUsers = useFilterByRegex(debouncedPhrase, userList, ['name']);

  useEffect(() => {
    console.log(filteredUsers);
  }, [filteredUsers]);
  useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);
  useEffect(() => {
    console.log();
  }, [selectedUser]);
  const ticketData = {
    buyOrder: { _id: orderId || 'brak id' },
    reportedUser: seller || selectedUser,
    description,
    images,
  };

  const uploadImages = async (ev) => {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }

      try {
        const res = await axios.post('/api/upload', data);
        setImages((prev) => [...prev, ...res.data.links]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const reportUser = async () => {
    try {
      const res = await axios.post('/api/ticket', ticketData);
      if (res.status === 200) {
        alert('Ticket submitted successfully!');
        setDescription('');
      }
      await axios.put('/api/buyOrder', { orderId, isRated: 'reported' });
      setRateOk();
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };
  const handleSelect = function () {};
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-mainBg text-red-300 z-50">
      <div className="absolute right-0 text-2xl p-6 ">
        <button
          className="hover:opacity-70 font-mono"
          onClick={() => router.back()}
        >
          X
        </button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center p-6 gap-4">
          <div className="opacity-0 animate-fade-in animation-delay-400 flex flex-col justify-center items-center">
            <p className="text-3xl mb-8">Zgłoś sprzedającego</p>
            {error && <p className="text-red-500">{error}</p>}
            {!username?.length > 0 && (
              <div className="relative">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  onFocus={onFocus}
                  onBlur={() => setTimeout(() => setFocused(false), 100)}
                  placeholder="Find user..."
                  className={`w-full bg-mainBg border border-gray-700  py-2 px-3 text-sm focus:rounded-b-none focus:outline-0 ${focused ? 'rounded-t-lg' : 'rounded-lg'}`}
                />
                <div className="flex justify-center w-full text-center mb-1">
                  <div className="absolute bg-mainBg rounded-lg  w-full text-white">
                    <div className="flex flex-col">
                      {focused &&
                        filteredUsers?.slice(0, 5)?.map((user) => (
                          <button
                            key={user._id}
                            className="px-2 py-1 border-gray-700 border hover:opacity-75 hover:border-gray-400 transition-all select-none"
                            onClick={() => setSelectedUser(user)}
                          >
                            {user?.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedUser?.name}

            <div className="justify-center flex p-4 bg-brighterBg rounded-lg w-[230px] h-[230px] mt-4">
              {!username && !seller && !selectedUser ? (
                <Image
                  src={img}
                  width={232}
                  height={232}
                  className="p-12 "
                  alt="default image"
                />
              ) : (
                <Image
                  src={seller?.avatar || selectedUser?.avatar || img}
                  width={232}
                  height={232}
                  className=""
                  alt="seller's avatar"
                />
              )}
            </div>
          </div>
          <div className="opacity-0 animate-fade-in animation-delay-400">
            <p>{seller?.name}</p>
          </div>
          <div
            className={`opacity-0 animate-fade-in ${selectedUser ? '' : 'hidden'} animation-delay-600 flex flex-col gap-2 items-center`}
          >
            <label>Treść zgłoszenia</label>
            <textarea
              className="text-black p-4 bg-gray-200"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        <div
          className={`opacity-0 animation-delay-1200 animate-fade-in ${selectedUser ? '' : 'hidden'}`}
        >
          <div className="flex flex-col items-center justify-center justify-items-center gap-6">
            <p>Załącz dowody (max 3 zdjęcia)</p>
            <div className="flex flex-row-reverse ">
              {images.length !== 3 && (
                <label className="w-24 h-24 flex flex-col items-center justify-center text-sm text-black rounded-lg bg-gray-200 cursor-pointer border border-primar gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                    />
                  </svg>
                  <p>Dodaj obraz</p>
                  <input
                    type="file"
                    className={`hidden ${!username && !seller && !selectedUser ? 'cursor-default' : ''}`}
                    disabled={
                      images.length === 3 ||
                      (!username && !seller && !selectedUser)
                    }
                    onChange={uploadImages}
                  />
                </label>
              )}

              <div className="flex relative">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className="relative w-[96px] h-[96px] group mr-4 "
                    onClick={() =>
                      setImages((prev) => prev.filter((img) => img !== image))
                    }
                  >
                    <Image
                      src={image}
                      fill
                      alt="uploaded"
                      className="rounded-lg"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-0 group-hover:opacity-70 transition text-gray-50 font-bold ">
                      X
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex gap-4 mt-6 opacity-0 animation-delay-1200 animate-fade-in ${selectedUser ? '' : 'hidden'}`}
        >
          <button
            onClick={reportUser}
            className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75"
          >
            Wyślij zgłoszenie
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75"
          >
            {' '}
            Cofnij
          </button>
        </div>
      </div>
    </div>
  );
}
