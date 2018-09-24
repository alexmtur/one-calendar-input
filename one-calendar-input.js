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
        //suggestions: Array,
    }}
    constructor() {
        super();  
        this.newItem = '';
        this.monthTable = [];
        this.setupCalendar();
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
        let cells = new Object();   
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
                //cell.recolor = false;
                cell.currentMonth = true;

                if(cell.month != m) {           //previous or next month
                    //cell.background = 'none';
                    //cell.color = colors.stable;
                    cell.currentMonth = false;
                } 
        //else if(cell.weekday == 0) {  //current month, sundays
        //   cell.background = 'none';
        //   cell.color = Common.color_selected();
        //   cell.recolor = true;
        // } 
        // else {                        //current month, working days
        //   cell.background = 'none';
        //   cell.color = colors.grey_ish;
        // }
        //cell.original_color = cell.color;

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
    signOut(e) {
        //console.log('bajioba');
        //console.log(e.target.value);
        let value = e.target.value;
        this.id('block' + value).scrollIntoView({behavior: 'smooth'}); //smooth behaviour does not work in Safari...

    }
     _render() {
        return html`
        
        <style>
            /* local DOM styles go here */
            :host {
                display: block;
                width: 100%;
            }
        </style>
        <one-slide-box bullets arrows>${this.weekdayString.map((i) => html`<div>${i}</div>`)}</one-slide-box>
        <button @click=${(e)=>{this.test()}}>Logout</button>
        <input type="range" @input=${(e)=>{this.signOut(e)}} min="1" max="9">
        <div style="height: 400px; width: 500px; overflow-x: scroll; border: 1px solid black; display: flex;">
            <div style="height: 400px; min-width: 500px; display:inline-block; background: pink" id="block1"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: yellow" id="block2"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: green" id="block3"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: pink" id="block4"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: yellow" id="block5"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: green" id="block6"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: pink" id="block7"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: yellow" id="block8"></div>
            <div style="height: 400px; min-width: 500px; display:inline-block; background: green" id="block9"></div>
        </div>
        <button on-click=${(e)=>{this.test()}}>scroll</button>

        <div width="100%">
        </div>
        `;}
}
customElements.define('one-calendar-input', OneCalendarInput);
