import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { AuthServiceClient, IAuthServiceClient } from "../../../pb/auth/auth.client";
import { IProductServiceClient, ProductServiceClient } from "../../../pb/product/product.client";
import { CartServiceClient, ICartServiceClient } from "../../../pb/cart/cart.client";
import { IOrderServiceClient, OrderServiceClient } from "../../../pb/order/order.client";
import { INewsletterServiceClient, NewsletterServiceClient } from "../../../pb/newsletter/newsletter.client";
import { authInterceptor } from "./auth-interceptor";

import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { 
  AuthServiceClient, 
  ProductServiceClient,
  CartServiceClient,
  OrderServiceClient,
  NewsletterServiceClient
} from "../../../pb";
import { RpcInterceptor, RpcOptions, RpcTransport, ServerStreamingCall, UnaryCall } from "@protobuf-ts/runtime-rpc";
import { MethodInfo } from "@protobuf-ts/runtime";



let webTransport: GrpcWebFetchTransport | null = null;
let authClient: IAuthServiceClient | null = null;
let productClient: IProductServiceClient | null = null;
let cartClient: ICartServiceClient | null = null;
let orderClient: IOrderServiceClient | null = null;
let newsletterClient: INewsletterServiceClient | null = null;

c// Type-safe enhanced interceptor
const enhancedInterceptor: RpcInterceptor = {
  interceptUnary(
    next: (method: MethodInfo, input: object, options: RpcOptions) => UnaryCall,
    method: MethodInfo,
    input: object,
    options: RpcOptions
  ): UnaryCall {
    // Apply auth interceptor first if exists
    const updatedOptions = authInterceptor?.interceptUnary 
      ? authInterceptor.interceptUnary(next, method, input, options)
      : next(method, input, options);

    // Add required gRPC-Web headers
    return next(method, input, {
      ...updatedOptions,
      meta: {
        ...updatedOptions.meta,
        'Content-Type': 'application/grpc-web+proto',
        'X-Grpc-Web': '1',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
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
