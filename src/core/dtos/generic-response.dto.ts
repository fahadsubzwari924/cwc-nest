export class GenericResponseDto<T> {
  payload?: T;
  metadata?: T;
  error?: string;

  constructor(data: any) {
    this.payload = data?.records;
    this.metadata = data?.metadata;
    this.error = data.error;
  }
}
