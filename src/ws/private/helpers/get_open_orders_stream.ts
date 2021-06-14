import { getPrivateSubscription } from '../private_ws_client'
import { ReplaySubject, Subject } from 'rxjs'
import { IOrderSnapshot } from '../../../types/order_snapshot'
import { PrivateWS } from '../../../types/ws/private'

export type OpenOrdersStream = {
    openOrders$: ReplaySubject<IOrderSnapshot[]>;
    currentOpenOrdersMap: Map<string, IOrderSnapshot>;
    openOrderIn$: Subject<IOrderSnapshot>;
    closedOrderOut$: Subject<IOrderSnapshot>;
    closedOrdersIds: Set<string>;
    openOrdersUnsubscribe: () => void;
}

/**
 * Returns a set of useful Observables/Objects around the openOrders PRIVATE-WS channel
 *
 * Helper method for: {@link https://docs.kraken.com/websockets/#message-openOrders | message-openOrders}
 *
 * @param tokenOrKeys - <OPTIONAL> { wsToken, injectedApiKeys }
 *      - If not passed, process.env keys will be used to generate a token.
 *      - If a wsToken is passed it'll be used directly (optimal performance).
 *      - Finally, if injectedApiKeys are passed, a new token will be generated on-the-fly.
 * @returns Promise<OpenOrdersStream>
 *
 * @beta
 */
export const getOpenOrdersStream = async ({ wsToken, injectedApiKeys }: PrivateWS.TokenOrKeys = {}): Promise<OpenOrdersStream> => {
    const openOrders$ = new ReplaySubject<IOrderSnapshot[]>(1);
    const currentOpenOrdersMap = new Map<string, IOrderSnapshot>()
    const openOrderIn$ = new Subject<IOrderSnapshot>();
    const closedOrderOut$ = new Subject<IOrderSnapshot>();

    const closedOrdersIds = new Set<string>();
    const openOrdersWS = await getPrivateSubscription({
        channelName: 'openOrders',
    }, { wsToken, injectedApiKeys })
    
    const { unsubscribe: openOrdersUnsubscribe } = openOrdersWS.subscribe(([ordersSnapshot, cn]) => {
        ordersSnapshot.forEach(orderSnapshot => {
            const [orderid] = Object.keys(orderSnapshot)
            if (closedOrdersIds.has(orderid)) { 
                currentOpenOrdersMap.delete(orderid)
                return
            }

            const mergedOrderSnapshot: IOrderSnapshot = {
                orderid, // injected
                price: orderSnapshot[orderid].avg_price, // injected
                reason: orderSnapshot[orderid].cancel_reason, // injected
                ...currentOpenOrdersMap.get(orderid),
                ...orderSnapshot[orderid],
            }

            if (!currentOpenOrdersMap.has(orderid)) {
                currentOpenOrdersMap.set(orderid, mergedOrderSnapshot)
                openOrderIn$.next(mergedOrderSnapshot)
            
            } else if (['closed', 'expired', 'canceled'].includes(mergedOrderSnapshot.status)) {
                closedOrdersIds.add(orderid)
                currentOpenOrdersMap.delete(orderid)
                closedOrderOut$.next(mergedOrderSnapshot)
            
            } else {
                currentOpenOrdersMap.set(orderid, mergedOrderSnapshot)
            }
        })

        openOrders$.next(Array.from(currentOpenOrdersMap.values()))

    }, openOrdersStreamError => {
        openOrders$.error(openOrdersStreamError)
        openOrderIn$.error(openOrdersStreamError)
        closedOrderOut$.error(openOrdersStreamError)
    })

    return {
        openOrders$,
        currentOpenOrdersMap,
        openOrderIn$,
        closedOrderOut$,
        closedOrdersIds,
        openOrdersUnsubscribe
    }
}
