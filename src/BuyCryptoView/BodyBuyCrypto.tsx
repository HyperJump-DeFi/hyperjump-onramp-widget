import React from 'react'
import styles from './styles.module.css'
import stylesCommon from '../styles.module.css'

import InputButton from '../common/Input/InputButton'
import InputText from '../common/Input/InputText'
import ExpectedCrypto from './ExpectedCrypto'

import IconBTC from '../icons/btc.svg'
import IconCC from '../icons/ccs.svg'
import IconUSD from '../icons/usd.svg'

type BodyBuyCryptoType = {
    onBuyCrypto: () => void,
    openPickCrypto: () => void,
    openPickCurrency: () => void,
    openPickPayment: () => void
}

const BodyBuyCrypto: React.FC<BodyBuyCryptoType> = (props) => {
    const { openPickCrypto, onBuyCrypto, openPickCurrency, openPickPayment } = props
    return (
        <main className={stylesCommon.body}>
            <InputButton onClick={openPickCrypto} className={stylesCommon['body__child']} label="I want to buy" selectedOption="Bitcoin" icon={IconBTC} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText className={stylesCommon['row-fields__child']} label="Amount" symbol="$" placeholder="100" />
                <InputButton onClick={openPickCurrency} className={stylesCommon['row-fields__child']} label="Currency" selectedOption="USD" icon={IconUSD} />
            </div>
            <InputButton onClick={openPickPayment} iconPosition="end" className={stylesCommon['body__child']} label="Payment method" selectedOption="Credit card" icon={IconCC} />
            <ExpectedCrypto className={`${stylesCommon['body__child']} ${stylesCommon.grow}`} amount={0.02} denom="BTC" />
            <button onClick={onBuyCrypto} className={`${stylesCommon['body__child']} ${styles['button-action']}`}>Get crypto</button>
        </main>
    )
}

export default BodyBuyCrypto