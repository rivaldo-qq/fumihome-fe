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

const enhancedInterceptor = {
  interceptUnary(next, method, input, options) {
    // First apply auth interceptor
    const updatedOptions = authInterceptor.interceptUnary 
      ? authInterceptor.interceptUnary(next, method, input, options)
      : next(method, input, options);

    // Add mandatory gRPC-Web headers
    updatedOptions.meta = {
      ...updatedOptions.meta,
      'Content-Type': 'application/grpc-web+proto', // Required
      'X-Grpc-Web': '1', // Required
      'X-Requested-With': 'XMLHttpRequest' // Avoids CORS preflight for simple requests
    };

    return updatedOptions;
  }
};

let transport: GrpcWebFetchTransport;

const getWebTransport = () => {
        webTransport = new GrpcWebFetchTransport({
            baseUrl: "https://cors-anywhere.herokuapp.com/https://grpcnya.zeabur.app",
            interceptors: [enhancedInterceptor],
             fetchInit: {
             mode: 'cors',
             credentials: 'omit', // Important for CORS
             },
        })

    return transport
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
