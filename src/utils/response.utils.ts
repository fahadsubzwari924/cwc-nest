import { CustomErrorResponse } from '../core/interfaces/controller-response.interface';

/**
 * @desc    returns a response raw object
 *
 * @param   {object} data
 */
export const createResponse = (data: any) => {
  return {
    payload: data,
    error: false,
  };
};

/**
 * @desc    returns a response raw object
 *
 * @param   {ExecutionContext} context
 * @param   {object} data
 */
export const createErrorResponse = (data: CustomErrorResponse) => {
  return {
    statusCode: data.statusCode,
    message: data?.message,
    error: true,
  };
};
