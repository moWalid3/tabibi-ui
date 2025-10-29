import { ICategoryDto } from "./category.model";

export interface IAddProduct {
  name: string;
  price: number;
  rating: number;
  quantity: number;
  summary: string | null;
  description: string | null;
  imageFile: File | null;
  categoryId: number;
}

export interface IUpdateProduct {
  name: string;
  price: number;
  rating: number;
  quantity: number;
  summary: string | null;
  description: string | null;
  imageFile: File | null;
  categoryId: number;
}

export interface IProductDto {
  id: number;
  name: string;
  price: number;
  rating: number;
  quantity: number;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
}

export interface  IGetAllProductsResponse {
	products: IProductWithCategory[];
	total: number;
}

export interface IProductWithCategory {
	id: number;
	name: string;
	price: number;
	rating: number;
	quantity: number;
	summary: string;
	description: string;
	imageUrl: string;
	categoryId: number;
	category: ICategoryDto;
}

export interface IGetAllProductsRequestParams {
  filterOn?: string;
  filterQuery?: string;
  sortBy?: string;
  isAscending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

