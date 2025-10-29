export interface IPatientDto {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  Gender: number | null;
  dateOfBirth: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}
