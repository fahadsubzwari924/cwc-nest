import { TransformFnParams } from 'class-transformer';

export function TransformStringToInt(params: TransformFnParams) {
  if (params.value === undefined || params.value === null) {
    return params.value;
  }

  if (typeof params.value === 'string') {
    return parseInt(params.value, 10);
  }

  return params.value;
}
