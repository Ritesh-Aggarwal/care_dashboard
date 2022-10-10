import { useState, useEffect } from 'react'
import {
  format,
  subMonths,
  addMonths,
  subYears,
  addYears,
  isEqual,
  getDaysInMonth,
  getDay,
} from 'date-fns'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'react-feather'
import { useQueryParams } from 'raviger'
import { UrlQuery } from '../types/urlQuery'
import _ from 'lodash'

type DatepickerType = 'date' | 'month' | 'year'

interface Props {
  selectedDate: any
  setSelectedDate: React.Dispatch<React.SetStateAction<any>>
  query: any
}

export default function SelectDate({
  selectedDate,
  setSelectedDate,
  query,
}: Props) {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const [dayCount, setDayCount] = useState<Array<number>>([])
  const [blankDays, setBlankDays] = useState<Array<number>>([])
  const [showDatepicker, setShowDatepicker] = useState(false)
  const [datepickerHeaderDate, setDatepickerHeaderDate] = useState(new Date())
  const [type, setType] = useState<DatepickerType>('date')
  const [urlQuery, setURLQuery] = useQueryParams<UrlQuery>()

  useEffect(() => {
    if (selectedDate)
      setURLQuery({
        ...urlQuery,
        [query]: format(selectedDate, 'yyyy-MM-dd'),
      })
    else setURLQuery(_.omit(urlQuery, query))
  }, [selectedDate])

  const decrement = () => {
    switch (type) {
      case 'date':
        setDatepickerHeaderDate((prev) => subMonths(prev, 1))
        break
      case 'month':
        setDatepickerHeaderDate((prev) => subYears(prev, 1))
        break
      case 'year':
        setDatepickerHeaderDate((prev) => subMonths(prev, 1))
        break
    }
  }

  const increment = () => {
    switch (type) {
      case 'date':
        setDatepickerHeaderDate((prev) => addMonths(prev, 1))
        break
      case 'month':
        setDatepickerHeaderDate((prev) => addYears(prev, 1))
        break
      case 'year':
        setDatepickerHeaderDate((prev) => subMonths(prev, 1))
        break
    }
  }

  const isToday = (date: number) =>
    isEqual(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date),
      selectedDate
    )

  const setDateValue = (date: number) => () => {
    setSelectedDate(
      new Date(
        datepickerHeaderDate.getFullYear(),
        datepickerHeaderDate.getMonth(),
        date
      )
    )
    setShowDatepicker(false)
  }

  const getDayCount = (date: Date) => {
    let daysInMonth = getDaysInMonth(date)

    // find where to start calendar day of week
    let dayOfWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 1))
    let blankdaysArray = []
    for (let i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i)
    }

    let daysArray = []
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i)
    }

    setBlankDays(blankdaysArray)
    setDayCount(daysArray)
  }

  const isSelectedMonth = (month: number) =>
    isEqual(
      new Date(selectedDate.getFullYear(), month, selectedDate.getDate()),
      selectedDate
    )

  const setMonthValue = (month: number) => () => {
    setDatepickerHeaderDate(
      new Date(
        datepickerHeaderDate.getFullYear(),
        month,
        datepickerHeaderDate.getDate()
      )
    )
    setType('date')
  }

  const toggleDatepicker = () => setShowDatepicker((prev) => !prev)

  const showMonthPicker = () => setType('month')

  const showYearPicker = () => setType('date')

  useEffect(() => {
    getDayCount(datepickerHeaderDate)
  }, [datepickerHeaderDate])

  return (
    <div>
      <div className="container mx-auto">
        <div className="relative">
          <input type="hidden" name="date" />
          <input
            type="text"
            readOnly
            className="input dark:text-white cursor-pointer pl-4 pr-10 py-3 shadow-sm focus:outline-none focus:shadow-outline font-medium"
            placeholder="Select date"
            value={
              selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '----/--/--'
            }
            onClick={toggleDatepicker}
          />
          <div
            className="cursor-pointer absolute top-0 right-0 px-3 py-2"
            onClick={toggleDatepicker}
          >
            <Calendar className="dark:text-white" />
          </div>
          {showDatepicker && (
            <div
              className="z-10 bg-white dark:bg-slate-800 mt-12 rounded-lg shadow p-4 absolute top-0 left-0"
              style={{ width: '17rem' }}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <button
                    type="button"
                    className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-primary-700 p-1 rounded-full"
                    onClick={decrement}
                  >
                    <ChevronLeft className="dark:text-white" />
                  </button>
                </div>
                {type === 'date' && (
                  <div
                    onClick={showMonthPicker}
                    className="flex-grow p-1 text-lg font-bold text-gray-900 dark:text-white hover:text-white cursor-pointer hover:bg-primary-700 rounded-lg"
                  >
                    <p className="text-center">
                      {format(datepickerHeaderDate, 'MMMM')}
                    </p>
                  </div>
                )}
                <div
                  onClick={showYearPicker}
                  className="flex-grow p-1 text-lg font-bold text-gray-900 dark:text-white hover:text-white cursor-pointer hover:bg-primary-700 rounded-lg"
                >
                  <p className="text-center">
                    {format(datepickerHeaderDate, 'yyyy')}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-primary-700 p-1 rounded-full"
                    onClick={increment}
                  >
                    <ChevronRight className="dark:text-white" />
                  </button>
                </div>
              </div>
              {type === 'date' && (
                <>
                  <div className="flex flex-wrap mb-3 -mx-1">
                    {DAYS.map((day, i) => (
                      <div key={i} style={{ width: '14.26%' }} className="px-1">
                        <div className="dark:text-white font-medium text-center text-xs">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap -mx-1">
                    {blankDays.map((_, i) => (
                      <div
                        key={i}
                        style={{ width: '14.26%' }}
                        className="text-center border p-1 border-transparent text-sm"
                      ></div>
                    ))}
                    {dayCount.map((d, i) => (
                      <div
                        key={i}
                        style={{ width: '14.26%' }}
                        className="px-1 mb-1"
                      >
                        <div
                          onClick={setDateValue(d)}
                          className={`cursor-pointer dark:text-white hover:text-white text-center text-sm leading-none rounded-full leading-loose transition ease-in-out duration-100 ${
                            selectedDate && isToday(d)
                              ? 'bg-primary-500 text-white'
                              : 'text-gray-700 hover:bg-primary-700'
                          }`}
                        >
                          {d}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {type === 'month' && (
                <div className="flex flex-wrap -mx-1">
                  {Array(12)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        onClick={setMonthValue(i)}
                        style={{ width: '25%' }}
                      >
                        <div
                          className={`cursor-pointer p-5 font-semibold dark:text-white hover:text-white text-center text-sm rounded-lg hover:bg-primary-700 ${
                            selectedDate && isSelectedMonth(i)
                              ? 'bg-primary-700 text-white'
                              : 'text-gray-700 hover:bg-primary-700'
                          }`}
                        >
                          {format(
                            new Date(
                              datepickerHeaderDate.getFullYear(),
                              i,
                              datepickerHeaderDate.getDate()
                            ),
                            'MMM'
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}{' '}
              {/* {type === 'year' && (
                <Datepicker
                  datepickerHeaderDate={datepickerHeaderDate}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  closeDatepicker={() => setShowDatepicker(false)}
                />
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
