import { SetMetadata } from '@nestjs/common';

export const NO_INTERCEPT_METADATA_KEY = 'no-intercept';

export const NoIntercept = () => SetMetadata(NO_INTERCEPT_METADATA_KEY, true);
