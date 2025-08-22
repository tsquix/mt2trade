import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  //TODO sanitize user input
  const handleMessage = async (e) => {
    e.preventDefault();
    if (messageSent) return;
    const msg = {
      email,
      message,
      topic,
    };
    const res = await axios.post('/api/messages', msg);
    console.log(msg);

    setMessageSent(true);
  };

  return (
    <div
      className={`h-full opacity-90 ${messageSent ? '' : 'bg-gradient-to-bl from-[#7C7C67] to-[#54393D]'}`}
    >
      <div className="py-12 lg:py-16 px-4 mx-auto max-w-screen-md ">
        <div
          className={`flex justify-center text-xl md:text-3xl text-[#dac7a7] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)] ${messageSent ? 'animate-fade-in-slow-rev' : 'opacity-0 hidden'}`}
        >
          <div className="absolute inline-block">
            {/* blur layer behind text */}
            <div className="absolute inset-0 backdrop-blur-xl bg-black/40"></div>

            {/* actual text, kept above blur */}
            <p className="relative px-4 py-1">Wysłano wiadomość pomyślnie</p>
            <p className="relative px-4 py-1">Dziękujemy za kontakt,</p>
            <p className="relative px-4 py-1">odezwiemy się wkrótce</p>
          </div>
        </div>
        <div
          className={`${messageSent ? 'animate-fade-out-slow' : 'opacity-100'}`}
        >
          <h2 className="mb-4 text-xl md:text-4xl tracking-wide font-extrabold text-center text-gray-900 dark:text-[#dac7a7] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)]">
            Skontaktuj się z nami
          </h2>
          <p className="font-light text-center text-[#dac7a7] dark:text-gray-300 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)] md:text-xl">
            Masz problem techniczny? Chcesz przesłać opinię o funkcji w wersji
            beta? Chcesz zawrzeć współpracę biznesową?
          </p>
          <p className="mb-8 lg:mb-16 font-light text-center text-[#dac7a7] dark:text-gray-300 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)] md:text-xl">
            Daj nam znać.
          </p>
        </div>

        <form
          onSubmit={handleMessage}
          className={`space-y-6 ${messageSent ? 'animate-fade-out-slow' : 'opacity-100 '}`}
        >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Twój adres e-mail
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-[#080607] dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dac7a7] dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="email@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Temat
            </label>
            <input
              type="text"
              id="subject"
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-[#080607] dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dac7a7] dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Powiedz nam, w czym możemy pomóc"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Twoja wiadomość
            </label>
            <textarea
              id="message"
              rows="6"
              className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-[#080607] dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dac7a7] dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Zostaw komentarz..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                required
                id="terms"
                className="w-4 h-4 accent-primary-600 rounded-sm border-gray-400 dark:border-gray-600 cursor-pointer focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <label
                htmlFor="terms"
                className="text-gray-300 text-xs tracking-tighter cursor-pointer select-none"
              >
                Akceptuję postanowienia etc*
              </label>
            </div>
            <span className="text-[10px] mb-2 text-red-100">*wymagane</span>
            <button
              type="submit"
              className="py-3 px-5 text-sm font-medium text-center text-[#dac7a7] rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-white/20 hover:opacity-80 transition-opacity duration-100"
            >
              Wyślij wiadomość
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
