import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { AuthServiceClient, IAuthServiceClient } from "../../../pb/auth/auth.client";
import { IProductServiceClient, ProductServiceClient } from "../../../pb/product/product.client";
import { CartServiceClient, ICartServiceClient } from "../../../pb/cart/cart.client";
import { IOrderServiceClient, OrderServiceClient } from "../../../pb/order/order.client";
import { INewsletterServiceClient, NewsletterServiceClient } from "../../../pb/newsletter/newsletter.client";
import { authInterceptor } from "./auth-interceptor";

let webTransport: GrpcWebFetchTransport | null = null;
let authClient: IAuthServiceClient | null = null;
let productClient: IProductServiceClient | null = null;
let cartClient: ICartServiceClient | null = null;
let orderClient: IOrderServiceClient | null = null;
let newsletterClient: INewsletterServiceClient | null = null;

const getWebTransport = () => {
    if (webTransport === null) {
        webTransport = new GrpcWebFetchTransport({
            baseUrl: "http://localhost:8080",
            interceptors: [authInterceptor],
        })
    }

    return webTransport
}

export const getAuthClient = () => {
    if (authClient === null) {
        authClient = new AuthServiceClient(getWebTransport());

    }

    return authClient
}

export const getProductClient = () => {
    if (productClient === null) {
        productClient = new ProductServiceClient(getWebTransport());

    }

    return productClient
}

export const getCartClient = () => {
    if (cartClient === null) {
        cartClient = new CartServiceClient(getWebTransport());
    }

    return cartClient;
}

export const getOrderClient = () => {
    if (orderClient === null) {
        orderClient = new OrderServiceClient(getWebTransport());
    }

    return orderClient;
}

export const getNewsletterClient = () => {
    if (newsletterClient === null) {
        newsletterClient = new NewsletterServiceClient(getWebTransport());
    }

    return newsletterClient;
}