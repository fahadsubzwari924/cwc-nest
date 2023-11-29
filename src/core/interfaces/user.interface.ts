export interface IUser {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  age?: number;
  country: string;
  city: string;
  contactNumber?: string;
  address?: string;
  createdAt?: Date;
}
