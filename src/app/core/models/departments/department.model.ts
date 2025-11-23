export interface IDepartmentDto {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAtUtc: string;
}

export interface IDepartmentPayload {
  name: string;
  description: string;
  imageUrl: string;
}
