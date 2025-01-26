import { IUser } from "../../../shared/interfaces/user.interface";

export interface IReduxAuthPayload {
  authInfo?: IUser;
}

export interface IReduxAddAuthUser {
  type: string;
  payload: IReduxAuthPayload;
}
