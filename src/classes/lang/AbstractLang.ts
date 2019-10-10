interface ISettings {
    arWeekDays: string[];
    arMonths: string[];
}
enum FirstWeekDay {
    MONDAY,
    SUNDAY
}
export default abstract class AbstractLang
{
    // enum firstWeekDay {MONDAY, SUNDAY};
    private arWeekDays:string[];
    private arMonths:string[];

    constructor(obSettings:ISettings){
        this.arWeekDays = obSettings.arWeekDays;
        this.arMonths = obSettings.arMonths;
    }

    public getMonth(monthNum:number){
        let shortMonthNum = monthNum % 12;
        return this.arMonths[shortMonthNum];
    }

    public getWeekDay(weekDayNum:number, mode:FirstWeekDay = FirstWeekDay.MONDAY){
        let shortWeekDayNum = mode === FirstWeekDay.MONDAY ? weekDayNum + 1 : weekDayNum;
        shortWeekDayNum %= 7;

        return this.arWeekDays[shortWeekDayNum];
    }
}