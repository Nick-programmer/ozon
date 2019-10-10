import {Component, Vue} from 'vue-property-decorator';
import Calendar from '@/components/Calendar';
import Events from '@/components/Events';

import './App.css'

@Component
export default class App extends Vue {
    public components = [
        Calendar,
        Events,
    ];

    render() {
        return (
            <div id="app" class={'app-container'}>
                <Calendar/>
                {(() => {
                    if (this.$store.state.activeDate) {
                        return (<Events class={'events-editor'}/>);
                    }

                })()}

            </div>
        )
    }
}
