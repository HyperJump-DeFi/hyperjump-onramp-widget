import "abort-controller/polyfill"
import { RateResponse } from './types/rate'
import { GatewaysResponse } from './types/gateways'
import { FieldError } from './types/nextStep'
import { NextStep } from '..'
import processMoonpayStep, {moonpayUrlRegex} from '@onramper/moonpay-adapter'

const BASE_API = process.env.STAGE === 'prod'
    ? 'https://api.onramper.com'
    : 'https://api.onramper.dev';

const headers = new Headers()

const authenticate = (pk: string) => {
    headers.set('Authorization', `Basic ${pk}`)
}

/**
 * API calls
 */
interface GatewaysParams {
    country?: string
    includeIcons?: boolean
    includeDefaultAmounts?: boolean
    [key: string]: any
}

const gateways = async (params: GatewaysParams, filter?: Filters): Promise<GatewaysResponse> => {
    const urlParams = createUrlParamsFromObject(params)
    const gatewaysRes = await fetch(`${BASE_API}/gateways?${urlParams}`, { headers })
    const gateways: GatewaysResponse = await processResponse(gatewaysRes)
    return filterGatewaysResponse(gateways, filter ?? {})
}

interface RateParams {
    country?: string
    amountInCrypto?: boolean
    [key: string]: any
}

const rate = async (currency: string, crypto: string, amount: number, paymentMethod: string, params?: RateParams, signal?: AbortSignal): Promise<RateResponse> => {
    const urlParams = createUrlParamsFromObject(params ?? {})
    const gateways = await fetch(`${BASE_API}/rate/${currency}/${crypto}/${paymentMethod}/${amount}?${urlParams}`, { headers, signal })
    return processResponse(gateways)
}

/**
 * Exectue step
 */
interface ExecuteStepParams {
    country?: string
    amountInCrypto?: boolean
    [key: string]: any
}

interface FetchResponse {
    ok: boolean,
    json: () => Promise<any>,
    text: () => Promise<string>
}

const executeStep = async (step: NextStep, data: { [key: string]: any } | File, params?: ExecuteStepParams): Promise<NextStep> => {

    if (step.type !== 'form' && step.type !== 'file') throw new Error('Unexpected error: Invalid step end.')

    const method = step.type === 'file' ? 'PUT' : 'POST'
    const body = step.type === 'file' ? data as File : JSON.stringify({ ...data })

    const urlParams = createUrlParamsFromObject(params ?? {})

    let nextStep: FetchResponse;
    if (isMoonpayStep(step.url)) {
        nextStep = await processMoonpayStep(step.url, { method, headers, body });
    } else {
        nextStep = await fetch(`${step.url}?${urlParams}`, { method, headers, body })
    }
    return processResponse(nextStep)
}

const isMoonpayStep = (stepUrl: string) => {
    if (process.env.STAGE === 'demo') //only for demo purposes
        return false
    return moonpayUrlRegex.test(stepUrl)
}

/**
 * Utils
 */
const processResponse = async (response: FetchResponse): Promise<any> => {
    if (response.ok)
        return await response.json()
    else {
        let errorResponse
        try {
            errorResponse = await response.json()
        } catch (error) {
            throw new NextStepError({ message: await response.text() })
        }
        throw new NextStepError(errorResponse)
    }
}

class NextStepError extends Error {
    fields?: FieldError[] = undefined
    field?: string = undefined
    fatal?: boolean = undefined
    constructor(error: any) {
        super("NextStep error");
        this.name = "NextStepError";
        this.fatal = error.fatal
        if (Array.isArray(error))
            this.fields = error
        else if (error.field) {
            this.field = error.field
            this.message = error.message
        }
        else
            this.message = error.message
    }
}

const createUrlParamsFromObject = (paramsObj: { [key: string]: any }): string =>
    Object.keys(paramsObj).reduce((acc, current, i, arr) => {
        if (paramsObj[current] !== undefined) {
            acc += `${current}=${paramsObj[current]}`
            if (i < arr.length - 1) acc += '&'
            return acc
        }
        return acc
    }, '')

interface Filters {
    onlyCryptos?: string[],
    excludeCryptos?: string[],
    onlyGateways?: string[]
}
const filterGatewaysResponse = (gatewaysResponse: GatewaysResponse, { onlyCryptos, excludeCryptos, onlyGateways }: Filters): GatewaysResponse => {
    const _onlyCryptos = onlyCryptos?.map(code => code.toUpperCase())
    const _excludeCryptos = excludeCryptos?.map(code => code.toUpperCase())
    const filtredGateways = gatewaysResponse.gateways.map(gateway => {
        let cryptosList = gateway.cryptoCurrencies
        if (_onlyCryptos && _onlyCryptos?.length > 0)
            cryptosList = gateway.cryptoCurrencies.filter(crypto => _onlyCryptos.includes(crypto.code))
        if (_excludeCryptos && _excludeCryptos?.length > 0)
            cryptosList = cryptosList.filter(crypto => !_excludeCryptos.includes(crypto.code))
        return {
            ...gateway,
            cryptoCurrencies: cryptosList
        }
    }).filter(gateway=>{
        if(onlyGateways === undefined){
            return true;
        }
        return onlyGateways.includes(gateway.identifier)
    })
    return {
        ...gatewaysResponse,
        gateways: filtredGateways
    }
}

export {
    authenticate,
    gateways,
    rate,
    executeStep,
    NextStepError
}
