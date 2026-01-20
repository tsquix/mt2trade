import { SORT_OPTIONS } from '@lib/constants/marketplace';

export const sortOffers = (offers, sortOption) => {
  if (!offers?.length) return offers;

  const sorted = [...offers];

  const sortFunctions = {
    [SORT_OPTIONS.YANG_ASC]: (a, b) => a.currencyAmount - b.currencyAmount,
    [SORT_OPTIONS.YANG_DESC]: (a, b) => b.currencyAmount - a.currencyAmount,
    [SORT_OPTIONS.PRICE_ASC]: (a, b) =>
      a.pricePLN / a.currencyAmount - b.pricePLN / b.currencyAmount,
    [SORT_OPTIONS.PRICE_DESC]: (a, b) =>
      b.pricePLN / b.currencyAmount - a.pricePLN / a.currencyAmount,
    [SORT_OPTIONS.RATING]: (a, b) => b.seller.userRating - a.seller.userRating,
    [SORT_OPTIONS.UPDATED_DESC]: (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    [SORT_OPTIONS.UPDATED_ASC]: (a, b) =>
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  };

  const compareFn = sortFunctions[sortOption];
  if (compareFn) {
    sorted.sort(compareFn);
  }

  return sorted;
};
