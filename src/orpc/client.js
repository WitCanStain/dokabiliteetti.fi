import { createRouterClient } from '@orpc/server';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { createIsomorphicFn } from '@tanstack/react-start';
import router from '@/orpc/router';

const getORPCClient = createIsomorphicFn()
    .server(() => createRouterClient(router, {
    context: () => ({
        headers: getRequestHeaders(),
    }),
}))
    .client(() => {
    const link = new RPCLink({
        url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
});
export const client = getORPCClient();
export const orpc = createTanstackQueryUtils(client);
