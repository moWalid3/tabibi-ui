export interface IPatientDto {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  gender: number;
  dateOfBirth: string | null;
  city: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}
