
export type TradePostData = {
    orderId: string
    direction: 'LONG' | 'SHORT'
    entryPrice: string
    entryAccountSize: string
    size:  string
    currentBtcPrice: string
    strategyName: string
}

export type TradeUpdateData = {
    exitPrice?: string
    exitAccountSize?: string
    exitedTradeAt?: string
}

export type Trade = {
    orderId: string
    direction: 'LONG' | 'SHORT'
    entryPrice: string
    entryAccountSize: string
    size:  string
    currentBtcPrice: string
    strategyName: string
    exitPrice?: string
    exitAccountSize?: string
    createdAt?: string
    updatedAt?: string
    exitedTradeAt?: string
    deletedAt?: string
}