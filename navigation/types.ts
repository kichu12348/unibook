export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OtpVerification: { email: string };
};

export type SuperAdminTabParamList = {
  Colleges: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  SuperAdmin: undefined;
};
