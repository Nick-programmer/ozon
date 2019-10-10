import { State, Mutation } from 'vuex-simple';
import Event from "@/classes/Event";
import AbstractLang from "@/classes/lang/AbstractLang";
import Rus from "@/classes/lang/Rus";

export default class Store {
    @State()
    public activeDate: Date;

    @State()
    public selectedMonthDate: Date;

    @State()
    public eventsMap: {
        [year:number]: {
            [month:number]: {
                [day:number]: Event[]
            }
        }
    };

    @State()
    public lang: AbstractLang;

    constructor() {
        this.activeDate = new Date();
        this.selectedMonthDate = new Date();
        this.eventsMap = {
            2019:{
                9:{
                    1:[new Event('Первое мероприятие', new Date(2019, 9, 1))],
                    10:[new Event('Второе мероприятие', new Date(2019, 9, 10))]
                }
            }
        };
        this.lang = new Rus();
    }

    @Mutation()
    activateDate(date:Date){
        this.activeDate = date;
    }

    @Mutation()
    shiftSelectedMonth(toRight:boolean = true){
        let selectedMonthDate:Date = this.selectedMonthDate;
        let month:number = selectedMonthDate.getMonth();
        let newMonth:number = toRight === true ? month + 1 : month - 1;
        selectedMonthDate.setMonth(newMonth);
    }

    @Mutation()
    addEvent(event:Event) {
        // console.log
        let arActiveEvents = this.getEvents() ;
        let newEventDate = event.date;
        let newEventTime = newEventDate.getTime();
        if(arActiveEvents.length > 0){
            let wasAdded = false;
            for(let i=0, n=arActiveEvents.length; i < n; i++){
                let curEventTime = arActiveEvents[i].date.getTime();
                if(curEventTime < newEventTime){
                    continue;
                }
                if(curEventTime > newEventTime){
                    arActiveEvents.splice(i, 0, event);
                    wasAdded = true;
                    break;
                }
            }
            if(wasAdded === false){
                arActiveEvents.push(event);
            }
        }else{
            let year = newEventDate.getFullYear();
            let month = newEventDate.getMonth();
            let day = newEventDate.getDate();
            this.eventsMap[year][month][day] = [event];
        }
    }

    hasEvents(date?:Date){
        let arActiveEvents = this.getEvents(date);
        return Array.isArray(arActiveEvents) && arActiveEvents.length > 0;
    }

    getEvents(date?:Date){
        if(!this.activeDate && !date){
            return [];
        }

        date = date ? date : this.activeDate;
        let year: number = date.getFullYear(),
            month: number = date.getMonth(),
            day: number = date.getDate();
        let hasEvents: boolean = typeof this.eventsMap[year] !== 'undefined'
            && typeof this.eventsMap[year][month] !== 'undefined'
            && typeof this.eventsMap[year][month][day] !== 'undefined'
            && Array.isArray(this.eventsMap[year][month][day]);
        if(hasEvents === false){
            return [];
        }

        return this.eventsMap[year][month][day];
    }
}