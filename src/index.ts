import { config } from 'dotenv';

const { parsed, error: loadConfigError } = config();

if (loadConfigError) {
    console.error({ loadConfigError });
} else {
    globalThis.env = { ...parsed };
}

/* Types exports */
export type { PublicRestTypes, PrivateRestTypes, PublicWsTypes, PrivateWsTypes } from './types';

/* Cherry-picked exports for consumer methods */
export { publicRestRequest } from './api/rest/public';
export { privateRestRequest } from './api/rest/private';

export { PublicWs } from './api/ws';
export {
    publicWsSubscription,
    publicWsRequest,
    connected$ as publicWsConnected$,
    disconnected$ as publicWsDisconnected$,
    heartbeat$ as publicWsHeartbeat$,
    status$ as publicWsStatus$,
} from './api/ws/public/public_ws_client';

export { PrivateWs } from './api/ws';
export {
    privateWsSubscription,
    privateWsRequest,
    connected$ as privateWsConnected$,
    disconnected$ as privateWsDisconnected$,
    heartbeat$ as privateWsHeartbeat$,
    status$ as privateWsStatus$,
} from './api/ws/private/private_ws_client';

export { getTickersPrices } from './api/rest/public/helpers/get_tickers_prices';
export { getOpenOrders, getClosedOrders, findClosedOrder, getWsAuthToken } from './api/rest/private/helpers';
