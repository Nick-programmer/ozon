export default class Event {
    private _date:Date;
    private _name:string;
    // public name:string;
    public constructor(name:string, date:Date = new Date){
        this._name = name;
        // this.name = name;
        this._date = date;
    }

    get name():string {
        return this._name;
    }
    get date():Date {
        return this._date;
    }
    // public getName(){
    //     return this.name;
    // }
}