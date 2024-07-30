/**
 * @desc    returns a response raw object
 *
 * @param   {ExecutionContext} context
 * @param   {object} data
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string = 'PKR',
) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};
