import { useStore } from 'vuex-simple';
import {Component} from 'vue-property-decorator';
import {VueComponent} from '../shims-vue';
import Event from '@/classes/Event.ts';
import CalendarHelper from '@/classes/CalendarHelper.ts';
import Store from "@/store/store";
import  './Events.css'

@Component
export default class Events extends VueComponent {
    public store: Store = useStore(this.$store);

    private timeFieldTimerId!: number;
    private eventTime: string = '';
    private eventName: string = '';
    private timeIsValid: boolean = false;
    private showAddingForm: boolean = false;

    constructor() {
        super();
    }

    public changeTime(e:InputEvent) {
        this.eventTime = e.target.value;
        this.validateTime();
    }

    public changeName(e:InputEvent) {
        this.eventName = e.target.value;
    }

    private validateTime() {
        clearTimeout(this.timeFieldTimerId);
        this.timeFieldTimerId = setTimeout(() => {
            this.timeIsValid = this.validTime();
        }, 2000);
    }

    private validTime():boolean{
        return /^(([0,1][0-9])|(2[0-3])):[0-5][0-9]$/.test(this.eventTime);
    }

    private addEvent() {
        if(!this.validTime() || !this.eventName){
            return;
        }
        let activeDate: Date = this.store.activeDate;
        let arTimes = this.eventTime.split(':');
        let eventDate = new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate(), +arTimes[0], +arTimes[1]);
        let event = new Event(this.eventName, eventDate);
        this.store.addEvent(event);
        this.eventTime = '';
        this.eventName = '';
        this.timeIsValid = false;
    }

    private cancelEventAddition() {
        this.showAddingForm = false;
        this.timeFieldTimerId = 0;
        this.timeIsValid = false;
        this.eventTime = '';
        this.eventName = '';
    }

    private showAddingFormAction() {
        this.showAddingForm = true;
    }

    private getEvents() {
        return this.store.getEvents();
    }

    render() {
        return (
            <div class={'events'}>
                <div class={'events__container'}>
                    <div class={'events__title'}>События</div>
                    <ul class={'events__list'}>
                        {
                            (() => {
                                let arActiveEvents = this.getEvents();
                                if (arActiveEvents.length < 1) {
                                    return;
                                }
                                return arActiveEvents.map(event =>
                                    <li class={'events__item'}>
                                        <div className="event__time">{CalendarHelper.getFormattedTime(event.date)}</div>
                                        <div class={'event__name'}>{event.name}</div>
                                    </li>
                                )

                            })()
                        }
                    </ul>
                    {(() => {
                        if (this.showAddingForm) {
                            return (
                                <div class={"events__editor"}>
                                    <div className="">
                                        <input type="text" class={'event__time-input'} oninput={this.changeTime} value={this.eventTime} placeholder={'Время'}/>
                                        <input type="text" class={'event__text-input'} disabled={!this.timeIsValid} oninput={this.changeName}
                                               value={this.eventName} placeholder={'Текст'}/>
                                    </div>
                                    <div class={"events__btns-container"}>
                                        <button class={'btn'} onclick={this.cancelEventAddition}>Отмена</button>
                                        <button class={'btn'} onclick={this.addEvent}>Сохранить</button>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div class={"events__btns-container"}>
                                <button class={['btn', 'add-btn']} onclick={this.showAddingFormAction}>Добавить</button>
                            </div>
                        );

                    })()}
                </div>
            </div>
        )
    }
}
