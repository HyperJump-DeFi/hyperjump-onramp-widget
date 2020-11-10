import React from 'react'
import HelpView from '../../../common/HelpView'
import Calendar from 'react-calendar';
import './calendar.css';
import { DEFAULT_VALUE } from './DateModule'

export interface DateType {
    day: number, month: number, year: number
}

interface DatePickerType {
    name: string
    value?: DateType
    onChange?: (name: string, value: any, type?: string) => void
}

const DatePicker: React.FC<DatePickerType> = (props) => {

    const { value = DEFAULT_VALUE } = props
    const startDate = Object.values(value).some(v => !Number.isInteger(+v)) ? undefined : new Date(`${value.year}-${value.month}-${value.day} 00:00`)
    return (
        <HelpView maxHeight={'315px'} fixedHeight>
            <Calendar
                maxDate={new Date()}
                onChange={date => {
                    if (props.onChange && date instanceof Date) {
                        const formattedDate = date.toLocaleDateString('en-CA', {})
                        props.onChange(props.name, {
                            year: +formattedDate.split('-')[0],
                            month: +formattedDate.split('-')[1],
                            day: +formattedDate.split('-')[2]
                        })
                    }
                }}
                value={startDate}
            />
        </HelpView>
    )
}

export default DatePicker