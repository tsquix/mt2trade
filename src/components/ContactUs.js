export default function ContactUs({ halfSection }) {
  return (
    <section className="relative h-[100vh] text-white bg-green-200">
      <div
        className={` p-4 pt-36 px-24 flex justify-between items-start transition-colors duration-500  ${
          halfSection ? 'text-black' : 'text-white'
        }`}
      ></div>
    </section>
  );
}
