import { IUser } from './IUser';

export interface IUseAuthenticated {
  user: IUser;
  token: string;
}
