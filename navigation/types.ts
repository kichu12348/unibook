export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OtpVerification: { email: string };
};

export type SuperAdminTabParamList = {
  Colleges: undefined;
  Profile: undefined;
};

export type CollegeAdminTabParamList = {
  Dashboard: undefined;
  Users: { filter?: 'pending' | 'all' } | undefined;
  Profile: undefined;
  ForumsAndVenues: { screen?: string } | undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  SuperAdmin: undefined;
  CollegeAdmin: undefined;
};
