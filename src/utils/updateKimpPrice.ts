// export const updateKimpPrice = (symbol: string, newKimp: number) => {
//   setKimpPrices(prevPrices => {
//     const prevKimp = prevPrices[symbol] ?? newKimp;
//     const isRising = newKimp > prevKimp;

//     setKimpColors(prevColors => ({
//       ...prevColors,
//       [symbol]: isRising ? 'red' : 'blue',
//     }));

//     return {
//       ...prevPrices,
//       [symbol]: newKimp,
//     };
//   });
// };
