import React from 'react'
import styles from '../styles.module.css'

import IconChevronRight from '../icons/chevron_right.svg'

function InputButton(props: { selectedOption: string, label?: string, icon?: string, className?: string, iconPosition?: 'start' | 'end' }) {
    const { selectedOption, label, icon, className = '', iconPosition = 'start' } = props
    return (
        <div className={`${styles['input']} ${className}`}>
            {label ? <label>{label}</label> : null}
            <div className={`${styles['input__type']} ${styles['input__type--selector']}`}>
                {icon ? <img alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? styles['input__type__child--old-first'] : ''}`} /> : null}
                <span style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} className={`${styles['input__type__child']} ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`}>{selectedOption}</span>
                <img alt="Chevron right" src={IconChevronRight} className={`${styles['input__type__child']} ${styles.input__icon} ${styles['input__icon--chevron']}`} />
            </div >
        </div >
    )
}

export default InputButton
