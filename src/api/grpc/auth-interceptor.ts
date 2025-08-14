import { RpcInterceptor } from "@protobuf-ts/runtime-rpc";

export const authInterceptor: RpcInterceptor = {
    interceptUnary(next, method, input, options) {
        const accessToken = localStorage.getItem('access_token');
        options.meta = {
            ...options.meta,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
        }
        if (typeof window !== 'undefined') {
      options.meta = {
        ...options.meta,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/grpc-web+proto',
      }
        return next(method, input, options);
    },
}
