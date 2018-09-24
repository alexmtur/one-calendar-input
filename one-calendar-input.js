import {OneClass, html} from '@alexmtur/one-class'
import {OneSlideBox} from '@alexmtur/one-slide-box'
//import {OneIcon} from '@alexmtur/one-icon'
//import {oneStyle} from '@alexmtur/one-style'

//One the index file add the following Polyfill:
// <script type="text/javascript">
//     import smoothscroll from 'smoothscroll-polyfill';
//     smoothscroll.polyfill();
// </script>

export class OneCalendarInput extends OneClass {
    static get properties() {return {
        list: {type: Array, public: true},
        newItem: String,
        displayedMonth: String,
        //Internal
        selectedI: Number,
        selectedJ: Number
        //suggestions: Array,
    }}
    constructor() {
        super();  
        this.newItem = '';
        this.monthTable = [];
        this.setupCalendar();
        this.selectedI = 0;
        this.selectedJ = 0;
    //console.log(me)        //this.suggestions = [];
    //polyfill();
    }
    setupCalendar() { //Creates a monthly table from the previous year up to 3 in the future
        //let month_table = new Object();
        let prev_year = (new Date().getFullYear()) - 1;
        let y = prev_year;                      //4 digits. Eg: 2015
        let m = 0;                              //0 - 11
        let d = 1;                              //1 - 31     
        //let w = getWeekday(new Date(y, m, d));  //0(sun) - 6(sat)
        let w = new Date(y, m, d).getDay();     //0(sun) - 6(sat)

        let today_y = new Date().getFullYear();
        let today_m = new Date().getMonth();
        let today_d = new Date().getDate();
        let today_pos = {i:0, j:0};
        let dateObj = {};

        //let colors = Common.colors();

        for(let i = 0; i < 60; ++i) {  
        let cells = [];   
            for(let j = 0; j < 42; ++j) {
                let cell = new Object();
                d = j - w + 1;
                dateObj = new Date(y, m, d);

                cell.i = i;
                cell.j = j;
                cell.date = dateObj.getDate();
                cell.month = dateObj.getMonth();
                cell.year = dateObj.getFullYear();
                cell.weekday = dateObj.getDay();
                cell.currentMonth = true;

                if(cell.month != m) {           //previous or next month
                    cell.currentMonth = false;
                } 

                if(y == today_y && m == today_m && d == today_d) {
                    today_pos.i = i;
                    today_pos.j = j;
                }
                cells[j] = cell;      
            }
            this.monthTable[i] = cells;
            m += 1;
            if(m > 11) {m = 0; y += 1;}
            d = 1;
            w = new Date(y, m, d).getDay();
        }

        let cell_selected = {i:today_pos.i, j:today_pos.j};
        this.weekdayString = ["Sunday", "Monday", "Tuesday", "Wednesday", 
                             "Thursday", "Friday", "Saturday"];
        this.monthString = ["January", "February", "March", "April", 
                           "May", "June", "July", "August", 
                           "September", "October", "November", "December"];
        console.log(this.monthTable);
    }
    test() {
        console.log('e');
        this.id('block2').scrollIntoView({behavior: 'smooth'});
    }
    updateDisplayMonth(e) {
        //console.log('bajioba');
        //console.log(e.target.value);
        let value = e.target.value;
        this.id('block' + value).scrollIntoView({behavior: 'smooth'}); //smooth behaviour does not work in Safari...
        this.displayedMonth = this.monthString[value];
    }
    selectDate(cell) {
        console.log(cell);
        this.selectedI = cell.i;
        this.selectedJ = cell.j;
        //this.requestUpdate();
    }
     _render() {
        return html`
        
        <style>
            /* local DOM styles go here */
            :host {
                display: block;
                width: 100%;
            }
            .cell[selected=true] {
                background: blue;
            }
            .cell {
                background: red;
                -webkit-transition: background .5s ease;
                -moz-transition: background .5s ease;

            }
        </style>
        <one-slide-box bullets arrows>${this.weekdayString.map((i) => html`<div>${i}</div>`)}</one-slide-box>
        <button @click=${(e)=>{this.test()}}>Today</button>
        <div>Month: ${this.displayedMonth}</div>
        <input type="range" @input=${(e)=>{this.updateDisplayMonth(e)}} min="0" max="11">

        <div style="height: 400px; width: 500px; overflow-x: hidden; border: 1px solid black; display: flex;">
            ${this.monthTable.map((cells, index) => 
                html`<div style="height: 400px; min-width: 500px; display:inline-block; background: pink" id=${'block' + index}>
                    ${cells.map((cell) => html`<div class="cell" selected=${cell.i === this.selectedI && cell.j === this.selectedJ ? true : false} style="border: 1px solid black; width:12%;display:inline-block;height:30px;margin:2px;" @click=${(e)=>{this.selectDate(cell)}}>${cell.date}</div>`)}
                </div>`)}
        </div>
        <div>Month: ${this.displayedYear}</div>
        <input type="range" @input=${(e)=>{this.signOut(e)}} min="0" max="4">

        <div width="100%">
        </div>
        `;}
}
customElements.define('one-calendar-input', OneCalendarInput);
