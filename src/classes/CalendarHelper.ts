export default class CalendarHelper {
    private todayDate: Date;
    // readonly weekDaysName = { 1:'Пн', 2:'Вт', 3:'Ср', 4:'Чт', 5:'Пт', 6:'Сб', 0:'Вс'};
    readonly weekDaysName = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    constructor(todayDate: Date = new Date()) {
        // todayDate = new Date(2019,3,30);
        this.todayDate = todayDate;
        // console.log('asdf');
        // for(let i in this.weekDaysName){
        //     console.log(this.weekDaysName[i]);
        // }
    }

    public getMonthDaysCount(year?: number, month?: number) {
        if (typeof year !== 'undefined' && typeof month != 'undefined') {
            return 32 - (new Date(year!, month!, 32)).getDate();
        }
        let curDate = new Date();
        curDate.setDate(32);

        return 32 - curDate.getDate();
    }

    public getWeekDay(date?: Date) {
        if (!date) {
            date = this.todayDate;
        }
        // console.log(date.getDay());
        return date.getDay();
    }

    public getTodayDate() {
        return this.todayDate;
    }

    public static getFormattedTime(date:Date){
        return this.to2Digits(date.getHours()) +':'+ this.to2Digits(date.getMinutes());
    }

    public static to2Digits(digit:number):string{
        return digit < 10 ? '0' + digit : '' + digit;
    }
}