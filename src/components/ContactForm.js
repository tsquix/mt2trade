export default function ContactForm() {
  return (
    <div class="h-full bg-gradient-to-bl from-[#7C7C67] to-[#54393D] opacity-90">
      <div class="py-12 lg:py-20 px-4 mx-auto max-w-screen-md">
        <h2 class="mb-4 text-xl md:text-4xl tracking-wide font-extrabold text-center text-gray-900 dark:text-[#dac7a7] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)]">
          Skontaktuj się z nami
        </h2>
        <p class="font-light text-center text-[#dac7a7] dark:text-gray-300 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)] md:text-xl">
          Masz problem techniczny? Chcesz przesłać opinię o funkcji w wersji
          beta? Chcesz zawrzeć współpracę biznesową?
        </p>
        <p class="mb-8 lg:mb-16 font-light text-center text-[#dac7a7] dark:text-gray-300 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)] md:text-xl">
          Daj nam znać.
        </p>
        <form action="#" class="space-y-8">
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Twój adres e-mail
            </label>
            <input
              type="email"
              id="email"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-[#080607] dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dac7a7] dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="email@gmail.com"
              required
            />
          </div>
          <div>
            <label
              for="subject"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Temat
            </label>
            <input
              type="text"
              id="subject"
              class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-[#080607] dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dac7a7] dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Powiedz nam, w czym możemy pomóc"
              required
            />
          </div>
          <div class="sm:col-span-2">
            <label
              for="message"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Twoja wiadomość
            </label>
            <textarea
              id="message"
              rows="6"
              class="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-[#080607] dark:border-gray-600 dark:placeholder-gray-400 dark:text-[#dac7a7] dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Zostaw komentarz..."
            ></textarea>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
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
