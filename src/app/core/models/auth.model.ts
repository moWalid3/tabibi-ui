export interface IUserRegisterDto {
  userName: string;
  email: string;
  password: string;
  address: string | undefined | null;
}

export interface IUserLoginDto {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterResponse {
  message: string;
}
