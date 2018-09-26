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
        //External Input
        monthString: String,
        weekdayString: String,
        mondayFirst: Boolean,
        //External Output
        date: {type: String, public: true},     //1 - 31 
        month: {type: String, public: true},    //0 - 11
        year: {type: String, public: true},     //4 digits. Eg: 2015
        dateObj: {type: Object, public: true},
        weekday: {type: String, public: true},  //0(sun) - 6(sat)
        //Internal
        selectedI: Number,
        selectedJ: Number,
        displayedMonth: String,
        displayedYear: String,
    }}
    constructor() {
        super();  
        this.monthTable = [];
        this.setupCalendar();
    }
    //add touch slide on the calendar. On touch end, scroll to the most visible object
    setupCalendar() { //Creates a monthly table from the previous year up to 3 in the future
        let previousYear = (new Date().getFullYear()) - 1;
        let y = previousYear;                      //4 digits. Eg: 2015
        let m = 0;                              //0 - 11
        let d = 1;                              //1 - 31     
        let w = new Date(y, m, d).getDay();     //0(sun) - 6(sat)

        let todayYear = new Date().getFullYear();
        let todayMonth = new Date().getMonth();
        let todayDate = new Date().getDate();
        let dateObj = {};

        for(let i = 0; i < 60; ++i) { //12 months * 5 year range
        let cells = [];   
            for(let j = 0; j < 42; ++j) { //7 weekdays * 6 rows
                let cell = new Object();
                d = j - w + 1;
                dateObj = new Date(y, m, d);

                cell.i = i;
                cell.j = j;
                cell.date = dateObj.getDate();
                cell.month = dateObj.getMonth();
                cell.year = dateObj.getFullYear();
                cell.dateObj = dateObj;
                cell.weekday = dateObj.getDay();
                cell.currentMonth = true;

                if(cell.month != m) {           //previous or next month
                    cell.currentMonth = false;
                } 

                if(y == todayYear && m == todayMonth && d == todayDate) { //select today's date
                    this.selectedI = i;
                    this.selectedJ = j;
                    this.displayedMonth = todayMonth;
                    this.displayedYear = 1;                    
                }
                cells[j] = cell;      
            }
            this.monthTable[i] = cells;
            m += 1;
            if(m > 11) {m = 0; y += 1;}
            d = 1;
            w = new Date(y, m, d).getDay();
        }

        //let cell_selected = {i:today_pos.i, j:today_pos.j};
        this.weekdayString = ["Sunday", "Monday", "Tuesday", "Wednesday", 
                             "Thursday", "Friday", "Saturday"];
        this.monthString = ["January", "February", "March", "April", 
                           "May", "June", "July", "August", 
                           "September", "October", "November", "December"];
        this.yearString = [String(previousYear), String(previousYear+1), String(previousYear+2), 
                        String(previousYear+3), String(previousYear+4)];
    }
    scrollCalendarPage(e) {
        if(e.target.id === 'monthSlider') {
            this.displayedMonth = e.target.value;
            this.sliderSelection = this.monthString[this.displayedMonth];
        }
        else if(e.target.id === 'yearSlider') {
            this.displayedYear = e.target.value;
            this.sliderSelection = this.yearString[this.displayedYear];
        }
        let calendarPage = this.getCalendarPage(this.displayedMonth, this.displayedYear);
        this.id('calendarPage' + calendarPage).scrollIntoView({behavior: 'smooth'}); //smooth behaviour does not work in Safari... Therefore, Polyfill imported
        if(!this.id('sliderSelection').visible) this.id('sliderSelection').show(); //slide-in-left as animation
    }
    //hideSlider
    updateCalendarPage(e) {
        console.log(e.target.id)
        console.log(e)
    } 
    dragCalendarPage(e) {
        console.log(e);
        e.preventDefault();
    }

    getCalendarPage(month, year) {
        return (Number(year) * 12 + Number(month));
    }
    selectDate(cell) {
        console.log(cell);
        this.selectedI = cell.i;
        this.selectedJ = cell.j;
        this.date = cell.date;
        this.month = cell.month;
        this.year = cell.year;
        this.dateObj = cell.dateObj;
        this.weekday = cell.weekday;
        //this.requestUpdate();
    }
    _firstRendered() {
        super._firstRendered();
        this.id('calendarPage' + this.selectedI).scrollIntoView();
    }
     _render() {
        return html`
        
        <style>
            /* local DOM styles go here */
            :host {
                display: block;
                
            }
            #calendarBody {
                position: relative;
                 
                width: 100%; 
                max-width: 500px;
                min-width: 200px;
                overflow-x: hidden; 
                border: 1px solid black; 
                display: flex;
                -webkit-box-shadow: 0 10px 6px -6px #777;
                -moz-box-shadow: 0 10px 6px -6px #777;
                box-shadow: 0 10px 6px -6px #777;
            }
            .calendarPage {
                
                min-width: 100%;  
                display:flex; 
                background: pink;
                z-index: 0;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
            }
            .cell {
                display:flex;
                background: red;
                justify-content: center;
                align-items: center;
                
                width:14.28%;
                height: 8vh;
                
                max-height:50px;
                
                -webkit-transition: background .5s ease;
                -moz-transition: background .5s ease;
            }
            .cell[selected=true] {
                background: blue;
            }
            .cell:hover {
                background: grey;
                cursor: pointer;
            }
            .cell[currentMonth=false] {
                background: yellow;
            }
            #sliderSelection { 
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                top:30%;
                height: 40%;
                width: 500px;
                background: rgba(100, 100, 100, 0.7);
                font-size: 60px;
                color: white;

                //move from left to right
            }
        </style>

        <div style="display: flex; ">
            <h2>${this.monthString[this.displayedMonth]}</h2>
            <input type="range"  min="0" max="11" id="monthSlider"
                @input=${(e)=>{this.scrollCalendarPage(e)}}
                @mouseup=${(e)=>{this.id('sliderSelection').hide()}} 
                @touchend=${(e)=>{this.id('sliderSelection').hide()}}
                value=${this.displayedMonth}>
        </div>

        <div style="position: relative;z-index: 100;">
            <div>${this.weekdayString.map((i) => html`<div>${i.slice(0, 3)}</div>`)}</div>
            
            <div id="calendarBody" @touchend=${(e)=>{this.updateCalendarPage(e)}} @mouseup=${(e)=>{this.updateCalendarPage(e)}} @touchmove=${(e)=>{this.dragCalendarPage(e)}}>
                ${this.monthTable.map((cells, index) => 
                    html`<div class="calendarPage" id=${'calendarPage' + index}>
                        ${cells.map((cell) => html`<div class="cell" currentMonth=${cell.currentMonth}
                            selected=${cell.i === this.selectedI && cell.j === this.selectedJ ? true : false} 
                            @click=${(e)=>{this.selectDate(cell)}}>${cell.date}</div>`)}
                    </div>`)}
                
            </div>
            <one-block id="sliderSelection" .visible=${false}>
                <div>${this.sliderSelection}</div>
            </one-block>
        
        </div>
        <div>Year: ${this.yearString[this.displayedYear]}</div>
        <input type="range" min="0" max="4" id="yearSlider"
            @input=${(e)=>{this.scrollCalendarPage(e)}}
            @mouseup=${(e)=>{this.id('sliderSelection').hide()}} 
            @touchend=${(e)=>{this.id('sliderSelection').hide()}}
            value=${this.displayedYear}>

        <div width="100%">
        </div>
        `;}
}
customElements.define('one-calendar-input', OneCalendarInput);

export class OneBlock extends OneClass {
    static get properties() {return {
        visible: {type: Boolean, public: true},    
    }}
    constructor() {
        super();  
    }
     _render() {return html`<style>:host(){}</style><div><slot></slot></div>`;}
}
customElements.define('one-block', OneBlock);
