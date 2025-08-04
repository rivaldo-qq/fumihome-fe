export interface CartCheckoutState {
    total: number;
    products: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        total: number;
    }[];
    cartIds: string[];
}