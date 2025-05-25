export interface ProductsEntity {
  productId: string;
  categoryId: string;
  categoryName: string;
  createdAt: CreatedAt;
  isDeleted: boolean;
  material: string;
  packageHeight: number;
  packageLength: number;
  packageWidth: number;
  productCreateTime: ProductCreateTime;
  productDescription: string;
  productImages: ProductImage[];
  productNameEn: string;
  productType: string;
  productUnit: string;
  productUpdateTime: ProductUpdateTime;
  productWeight: number;
  productsku: string;
  updatedAt: UpdatedAt;
  synced: boolean;
  variants: Variant[];
}

export interface CreatedAt {
  $date: string;
}

export interface ProductCreateTime {
  $date: string;
}

export interface ProductImage {
  imageUrl: string;
  imageSortOrder: number;
}

export interface ProductUpdateTime {
  $date: string;
}

export interface UpdatedAt {
  $date: string;
}

export interface Variant {
  variantId: string;
  variantKey: string;
  variantSku: string;
  variantNameEn: string;
  variantWeight: number;
  variantVolume: number;
  variantCreateTime: VariantCreateTime;
  variantUpdateTime: VariantUpdateTime;
  properties: any[];
  price: Price;
  variantImage: string;
}

export interface VariantCreateTime {
  $date: string;
}

export interface VariantUpdateTime {
  $date: string;
}

export interface Price {
  variantSellPrice: number;
  sellPrice: number;
}
