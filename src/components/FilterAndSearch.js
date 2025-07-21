import { useOrders } from '@/contexts/OrdersContext';

export default function FilterAndSearch({ handleSort }) {
  const { state } = useOrders();
  const { isLoading } = state;
  if (isLoading) {
    return (
      <div className="animate-pulse bg-mainBg p-4 rounded-xl border mb-1 ">
        <div className="flex justify-between mb-2">
          <div className="px-1 mb-3 pb-4 bg-brighterBg  w-24 rounded-3xl text-xs "></div>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-2">
          <div>
            <p className="text-lightGray mb-1"></p>
            <div className="px-1 mb-3 py-4 bg-brighterBg  w-32 rounded-lg text-xs "></div>
          </div>
          <div>
            <p className="text-lightGray mb-1"></p>
            <div className="px-1 mb-3 py-4 bg-brighterBg  w-32 rounded-lg text-xs "></div>
          </div>
          <div className="">
            <div className="px-1 mb-3 py-1 bg-brighterBg  w-24 rounded-lg text-xs "></div>
          </div>
        </div>
        <div className="relative">
          <div className="px-1 mb-3 py-4 bg-brighterBg  w-full rounded-lg text-xs "></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-brighterBg p-4 rounded-xl">
      <div className="flex justify-between mb-2">
        <p>Filtruj</p>
        <p className="text-red-300">Clear All</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lightGray mb-1">Zakres cen</p>
          <select
            onChange={handleSort}
            className="text-white bg-mainBg rounded-lg p-2 border w-full border-gray-700"
          >
            <option value="">Cena</option>
            <option value="yangAsc">Ilosc yang ASC</option>
            <option value="yangDesc">Ilosc yang DESC</option>
            <option value="priceAsc">Najtaniej</option>
            <option value="priceDesc">Najdrozej</option>
          </select>
        </div>
        <div>
          <p className="text-lightGray mb-1">Opinie</p>
          <select
            onChange={handleSort}
            className="text-white bg-mainBg rounded-lg p-2 border w-full  border-gray-700"
          >
            <option value="">Opinie</option>

            <option value="rating">UserRating</option>
            <option value="updatedAtDesc">updatedAtDesc</option>
            <option value="updatedAtAsc">updatedAtAsc</option>
          </select>
        </div>
        <div className="">
          <label className="block text-sm text-gray-400 mb-1">Search</label>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search offers..."
          className="w-full bg-mainBg border border-gray-700 rounded-lg py-2 px-3 text-sm"
        />
      </div>
    </div>
  );
}
