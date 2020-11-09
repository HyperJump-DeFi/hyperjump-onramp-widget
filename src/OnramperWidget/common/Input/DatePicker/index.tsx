import React from 'react'
import HelpView from '../../../common/HelpView'
import Calendar from 'react-calendar';
import './calendar.css';

interface DatePickerType {
    name: string
    value?: {
        day: string,
        month: string,
        year: string
    }
    onChange?: (name: string, value: any, type?: string) => void
}

const DEFAULT_VALUE = {
    day: 'dd',
    month: 'mm',
    year: 'yyyy'
}

const DatePicker: React.FC<DatePickerType> = (props) => {

    const startDate = props.value ?? DEFAULT_VALUE

    return (
        <HelpView maxHeight={'315px'} fixedHeight>
            <Calendar
                maxDate={new Date()}
                onChange={date => {
                    if (props.onChange && date instanceof Date) {
                        const formattedDate = date.toLocaleDateString('en-CA', {})
                        props.onChange(props.name, {
                            year: formattedDate.split('-')[0],
                            month: formattedDate.split('-')[1],
                            day: formattedDate.split('-')[2]
                        })
                    }
                }}
                activeStartDate={new Date(+startDate.year, +startDate.month, +startDate.day)}
            />
        </HelpView>
    )
}

export default DatePicker