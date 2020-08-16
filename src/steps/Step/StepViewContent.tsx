import React, { useContext, useEffect } from 'react'
import stylesCommon from '../../styles.module.css'

import ConfirmPaymentView from '../ConfirmPaymentView'
import UploadView from '../UploadView'
import PickOptionView from '../PickOptionView'
import VerifyCodeView from '../VerifyCodeView'
import EmailView from '../EmailView'
import FormView from '../FormView'

import { NavContext } from '../../wrappers/context'

import { NextStep } from '../../common/types'

const StepViewContent: React.FC<NextStep> = (nextStep) => {
    const { replaceScreen, backScreen } = useContext(NavContext);


    useEffect(() => {
        const nextStepData = nextStep.data || []
        switch (nextStep.type) {
            case 'form':
                if (nextStepData.length === 1) {
                    if (nextStepData[0].name === 'email')
                        replaceScreen(<EmailView nextStep={nextStep} />)
                    else if (nextStepData[0].name === 'verifyEmailCode')
                        replaceScreen(<VerifyCodeView nextStep={nextStep} codeType='email' name='email' />)
                }
                else
                    replaceScreen(<FormView nextStep={nextStep} />)
                break;
            case 'iframe':
                replaceScreen(<ConfirmPaymentView nextStep={nextStep} />)
                break;
            case 'file':
                replaceScreen(<UploadView nextStep={nextStep} />)
                break;
            case 'pickOne':
                replaceScreen(<PickOptionView nextStep={nextStep} />)
                break;
            default:
                break;
        }
    }, [nextStep, replaceScreen, backScreen])

    return (
        <main className={stylesCommon.body}>
            <span>
                Oops... that shouldn't happen, please contact us (onramper.com).
            </span>
        </main>
    )
}

export default StepViewContent