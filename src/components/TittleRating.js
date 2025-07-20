import { Rating } from 'react-simple-star-rating';
export default function TitleRating({
  offer,
  displayRatingNumber,
  className,
  smaller,
  mode = 'default',
  status = 'view',
  newOffer,
  handleEdit,
}) {
  const isEditing = mode === 'profile' && status === 'edit';

  // useEffect(() => {
  //   console.log(offer?.seller?.userRating);
  // }, [offer]);

  if (!offer || !offer.seller) return null;

  const formatPricePer1kk = () => {
    const raw = offer?.pricePLN / offer?.currencyAmount;
    if (!isFinite(raw)) return '0';
    return raw.toFixed(2).endsWith('.00') ? raw.toFixed(0) : raw.toFixed(2);
  };

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div className="bg-brighterBg">
          {!smaller && (
            <p className="text-xs text-gray-300 mb-1">{offer?.serverName}</p>
          )}

          <div className={`${smaller ? '' : 'text-2xl'}`}>
            {isEditing ? (
              <input
                type="text"
                value={newOffer.title || ''}
                onChange={(e) => handleEdit('title', e.target.value)}
                placeholder={`${offer.title || 'Wpisz tytuł oferty'}`}
                className="bg-darkBg text-black rounded px-2 py-1 w-full"
              />
            ) : (
              <strong>{offer?.title || '50M Yang - Fast Delivery'}</strong>
            )}
          </div>

          <div className="flex">
            <div className="text-sm font-bold">
              <div
                className={`flex items-center ${
                  displayRatingNumber ? 'gap-3' : 'gap-2'
                }`}
              >
                <div className="mb-1 items-center justify-center text-center">
                  <Rating
                    readonly
                    SVGclassName="inline"
                    initialValue={offer?.seller?.userRating || 0}
                    allowFraction
                    size={17}
                    fillColor="#facc15"
                    emptyColor="#e5e7eb"
                  />
                </div>
                {displayRatingNumber && (
                  <p className="text-xs text-white">
                    {offer?.seller?.userRating?.toFixed(1)}
                  </p>
                )}
                <p className="text-xs text-lightGray">
                  ({offer?.seller?.transactionCount} sales)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brighterBg text-right">
          {isEditing ? (
            <>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={1}
                  className="bg-darkBg text-black text-right px-2 py-1 rounded w-20 mb-1"
                  value={newOffer.currencyAmount}
                  onChange={(e) =>
                    handleEdit('currencyAmount', Number(e.target.value))
                  }
                  placeholder={newOffer.currencyAmount}
                />
                <p className="text-red-300">kk</p>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="bg-darkBg text-black text-right px-2 py-1 rounded w-20 mt-1"
                  value={newOffer.pricePLN}
                  onChange={(e) =>
                    handleEdit('pricePLN', Number(e.target.value))
                  }
                />
                <p className="text-xs text-lightGray font-semibold">
                  zł za {newOffer.currencyAmount} kk
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-red-300">
                {offer?.currencyAmount} {offer?.tag !== '' ? 'kk' : 'Wony'}
              </p>
              <p className="text-xs text-lightGray font-semibold">
                {formatPricePer1kk()} zł za 1kk
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
