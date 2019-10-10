import { useStore, useModule } from 'vuex-simple';
import Store from '@/store/store';

import {Component, Prop, Vue} from 'vue-property-decorator';

import {VueComponent} from '../shims-vue';
import CalendarHelper from '../classes/CalendarHelper';

// import styles from './Calendar.css?module'
import './Calendar.css'

interface CalendarCell {
    date: Date,
    hasEvents: boolean,
    isActiveMonth: boolean
}

@Component
export default class Calendar extends VueComponent {
    public store: Store = useStore(this.$store);

    public arCalendar: CalendarCell[][];
    public readonly obCalendarHelper!: CalendarHelper;
    // public arWeekDays: number[] = [1, 2, 3];

    constructor() {
        super();
        this.obCalendarHelper = new CalendarHelper();
        this.arCalendar = [];
        // this.fillCalendar(new Date());
    }

    public fillCalendar(date: Date) {
        let year: number = date.getFullYear();
        let month: number = date.getMonth();
        let monthDay: number = date.getDate();
        let weekDay: number = date.getDay();
        let monthDaysCount: number = this.obCalendarHelper.getMonthDaysCount(year, month);
        let prevMonthWeekDaysCount = (weekDay ? weekDay : 7) - monthDay % 7;
        if (prevMonthWeekDaysCount < 0) {
            prevMonthWeekDaysCount = 7 + prevMonthWeekDaysCount;
        }
        let prevMonthDaysCount = this.obCalendarHelper.getMonthDaysCount(year, month - 1);
        let nextMonthWeekDaysCount = 7 - (prevMonthWeekDaysCount + monthDaysCount) % 7;
        if (nextMonthWeekDaysCount === 7) {
            nextMonthWeekDaysCount = 0;
        }
        let prevMonth = month - 1;

        this.arCalendar = [];
        let arWeek: CalendarCell[] = [];
        //Заполним дни, которые отображаются с прошлого месяца
        for (let i = 0; i < prevMonthWeekDaysCount; i++) {
            let cellDate: Date = new Date(year, prevMonth, prevMonthDaysCount - i);
            let obCalendarCell: CalendarCell = {
                date: cellDate,
                hasEvents: this.store.hasEvents(cellDate),
                isActiveMonth: false,
            };
            arWeek.push(obCalendarCell);
        }

        //Заполним текущий месяц
        let curIndex: number = prevMonthWeekDaysCount;
        for (let i = 1; i <= monthDaysCount; i++) {
            if (curIndex === 7) {
                this.arCalendar.push(arWeek);
                curIndex = 0;
                arWeek = [];
            }
            let cellDate: Date = new Date(year, month, i);
            let obCalendarCell: CalendarCell = {
                date: cellDate,
                hasEvents: this.store.hasEvents(cellDate),
                isActiveMonth: true,
            };
            arWeek.push(obCalendarCell);
            curIndex++;
        }

        //Заполним дни, которые отображаются по сдедующему месяцу
        let nextMonth = month + 1;
        for (let i = 1; i <= nextMonthWeekDaysCount; i++) {
            let cellDate: Date = new Date(year, nextMonth, i);
            let obCalendarCell: CalendarCell = {
                date: cellDate,
                hasEvents: this.store.hasEvents(cellDate),
                isActiveMonth: false,
            };
            arWeek.push(obCalendarCell);
        }
        if (arWeek.length > 0) {
            this.arCalendar.push(arWeek);
        }
    }

    public activateDate(date: Date) {
        this.store.activateDate(date);
    }

    public created() {
        this.fillCalendar(new Date());
    }

    public getWeekDaysNames() {
        let arWeekDaysNames = [];
        for (let i = 0; i < 7; i++) {
            arWeekDaysNames.push(this.store.lang.getWeekDay(i));
        }

        return arWeekDaysNames;
    }

    private getFormattedDate(): string {
        let selectedMonthDate: Date = this.store.selectedMonthDate;
        let resStr: string = this.store.lang.getMonth(selectedMonthDate.getMonth()) + ' ' + selectedMonthDate.getFullYear();

        return resStr;
    }

    private shiftMonthToRight() {
        this.store.shiftSelectedMonth();
        this.fillCalendar(this.$store.state.selectedMonthDate);

    }

    private shiftMonthToLeft() {
        this.store.shiftSelectedMonth(false);
        this.fillCalendar(this.store.selectedMonthDate);
    }

    private isActiveDate(date:Date){
        let activeDate:Date|null = this.$store.state.activeDate;
        if(!activeDate){
            return false;
        }

        return activeDate.getFullYear() === date.getFullYear()
            && activeDate.getMonth() === date.getMonth()
            && activeDate.getDate() === date.getDate()
    }

    render() {
        return (
            <div class={'calendar'}>
                <div class={'calendar__container'}>
                    <div class={'calendar__cntrl'}>
                        <div>{this.getFormattedDate()}</div>
                        <div class={"calendar__cntrl-btns"}>
                            <div class={'cntrl-btn__container'}>
                                <div class={'calendar__cntrl-btn'} onClick={this.shiftMonthToLeft}>&lt;</div>
                            </div>
                            <div class={'cntrl-btn__container'}>
                                <div class={'calendar__cntrl-btn'} onClick={this.shiftMonthToRight}>&gt;</div>
                            </div>
                        </div>
                    </div>
                    <div class={['calendar__weekdays', 'calendar__week-row']}>
                        {this.getWeekDaysNames().map(name =>
                            <li class={'calendar__cell-container'}>
                                <div class={'calendar__cell'}>{name}</div>
                            </li>
                        )}
                    </div>
                    <div class={'calendar__values'}>
                        {
                            this.arCalendar.map(arWeekDays =>
                                <div class={'calendar__week-row'}>
                                    {arWeekDays.map(dayCell => {
                                        let arClasses:string[] = ['calendar__day', 'calendar__cell'];
                                        if(dayCell.hasEvents === true){
                                            arClasses.push('has-events');
                                        }
                                        if(dayCell.isActiveMonth === false){
                                            arClasses.push('not-active-month');
                                        }
                                        if(this.isActiveDate(dayCell.date)){
                                            arClasses.push('is-active-day');
                                        }
                                        return (
                                            <div class={'calendar__cell-container'}>
                                                <div class={arClasses}
                                                     onClick={this.activateDate.bind(this, dayCell.date)}>
                                                    {dayCell.date.getDate()}
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        )
    }
}
