import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import InputCryptoAddr from '../../common/Input/InputCryptoAddr'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

import { APIContext } from '../../context'

type BodyFormViewType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    fields: {
        name: string
        type: string
        humanName: string
    }[]
    isFilled?: boolean
    isLoading?: boolean
    errorMsg?: string
    inputName?: string
    onErrorDismissClick: () => void
}

const BodyFormView: React.FC<BodyFormViewType> = (props) => {
    const { handleInputChange, onActionButton, fields = [] } = props
    const { collected } = useContext(APIContext);
    const { isFilled = false, isLoading = false, errorMsg } = props

    const onChange = (name: string, value: any, type?: string) => {
        let v = value
        if (type === 'date') {
            v = {
                year: Number(value.split('-')[0]),
                month: Number(value.split('-')[1]),
                day: Number(value.split('-')[2])
            }
        }
        handleInputChange(name, v)
    }

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={errorMsg !== undefined} type='error' canBeDismissed onDismissClick={props.onErrorDismissClick} className={`${stylesCommon['body__child']}`} >
                {errorMsg}
            </InfoBox>
            {
                fields.map((dataName, i) =>
                    <div key={i} className={`${stylesCommon['body__child']}`}>
                        {
                            dataName.name === 'cryptocurrencyAddress' ?
                                <InputCryptoAddr handleInputChange={handleInputChange} />
                                : <InputText name={dataName.name} value={collected[dataName.name] ?? ''} onChange={onChange} className={stylesCommon['body__child']} label={dataName.humanName} type={dataName.type} />
                        }
                    </div>
                )
            }
            <div className={`${stylesCommon['body__child']} ${stylesCommon['grow']}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Sending...' : 'Continue'} disabled={!isFilled || isLoading} />
            </div>
        </main >
    )
}

BodyFormView.defaultProps = {

}

export default BodyFormView