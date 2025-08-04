export interface ProductFormValues {
    name: string;
    price: number;
    description?: string;
    image: FileList;
    imageUrl?: string;
}