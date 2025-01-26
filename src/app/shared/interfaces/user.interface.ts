export interface InitialUpdateType {
  user: IUser | null;
}

export interface IUser {
  id: string;
  email: string;
  createdAt?: Date;
}
