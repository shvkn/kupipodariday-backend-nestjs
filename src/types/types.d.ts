declare interface IUser {
  email: string;
}

declare interface IJwtPayload {
  user: IUser;
  iat: number;
  exp: number;
}
