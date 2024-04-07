import { env } from './constants.ts'

const authorization = env.API_AUTHORIZATION_KEY

export const isAuthorized = (ctx: any) => {
    const requestToken = ctx.request.headers.get('Authorization')
    if (requestToken === authorization) return true
    ctx.response.status = 401
    ctx.response.body = 'unauthorized'
    return false
}

export const setHeaders = (ctx: any) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*")
    ctx.response.headers.set("Cache-Control", "no-cache")
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
    ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
}

export const errorResponse = (ctx: any, e: any) => {
    console.error(e)
    ctx.response.status = 500
    ctx.response.body = 'something went wrong'
}