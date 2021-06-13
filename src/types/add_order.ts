// WS: https://docs.kraken.com/websockets/#message-addOrder
// REST API: https://docs.kraken.com/rest/#operation/addOrder

type IAddOrderSide = 'buy' | 'sell';
type IAddOrderType = 'market' | 'limit' | 'stop-loss' | 'take-profit' | 'stop-loss-limit' | 'take-profit-limit' | 'settle-position';
type IAddOrderCloseType = 'limit' | 'stop-loss' | 'take-profit' | 'stop-loss-limit' | 'take-profit-limit';

export type IAddOrder = {
    ordertype: IAddOrderType;
    type: IAddOrderSide;
    volume: string;
    pair: string; // Asset pair id or altname
    price: string;
    price2?: string;
    leverage?: string;
    oflags?: string;
    starttm?: string;
    expiretm?: string;
    close?: {
        ordertype?: IAddOrderCloseType;
        price?: string;
        price2?: string;
    };
    trading_agreement?: 'agree';
    validate?: boolean;
}
