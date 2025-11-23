export interface IDoctorDto {
  id: string;
  name: string;
  email: string;
  status: string;
  statusCode: number;
  avatarUrl: string | null;
  gender: number;
  dateOfBirth: string | null;
  consultationFee: number | null;
  yearsOfExperience: number | null;
  city: string | null;
  department: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface IDoctorDetailsDto {
  id: string;
  name: string;
  email: string;
  status: string;
  statusCode: number;
  avatarUrl: string | null;
  gender: number;
  dateOfBirth: string | null;
  bio: string | null;
  credentialImageUrl: string | null;
  consultationFee: number;
  yearsOfExperience: number;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  department: {
    id: string;
    name: string;
  } | null;
  clinic: {
    name: string;
    description: string | null;
    address: string;
    imageUrl: string | null;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    city: {
      id: string;
      name: string;
    };
  } | null;
  schedule: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[] | null;
}
