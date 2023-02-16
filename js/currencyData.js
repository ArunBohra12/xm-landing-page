const currencies = ['bitcoin', 'ethereum', 'ripple', 'litecoin', 'bitcoin-cash'];

/**
 * It fetches data from the Coinlore API and returns the data
 * @returns An array of objects.
 */
const getCurrencyData = async () => {
  const res = await fetch('https://api.coinlore.net/api/tickers/');

  const { data } = await res.json();

  return data;
};

/**
 * Gets the currencies and filters out the currencies we don't want, and returns the
 * result
 * @returns An array of currency object.
 */
export const getCurrencies = async () => {
  const currenciesData = await getCurrencyData();

  return currenciesData.filter((currency) => currencies.includes(currency.nameid));
};
