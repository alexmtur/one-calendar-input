import {OneClass, html} from '@alexmtur/one-class'
import {OneSlideBox} from '@alexmtur/one-slide-box'
import {oneStyle} from '@alexmtur/one-style'
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
        displayedMonth: Number,
        displayedYear: Number,
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
                    this.displayedCalendarPage = i;                  
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
            this.displayedMonth = Number(e.target.value);
            this.sliderSelection = this.monthString[this.displayedMonth];
        }
        else if(e.target.id === 'yearSlider') {
            this.displayedYear = Number(e.target.value);
            this.sliderSelection = this.yearString[this.displayedYear];
        }
        this.displayedCalendarPage = this.getCalendarPage(this.displayedMonth, this.displayedYear);
        this.id('calendarPage' + this.displayedCalendarPage).scrollIntoView({behavior: 'smooth'}); //smooth behaviour does not work in Safari... Therefore, Polyfill imported
        if(!this.id('sliderSelection').visible) this.id('sliderSelection').show(); //slide-in-left as animation
    }
    setupDrag(e) {
        e.preventDefault();
        this.mousedown = true;
        this.initialX = e.pageX;
        this.initialScrollX = this.id('calendarBody').scrollLeft;
        this.scrollDelta = 0;
        return false;
    }
    dragCalendarPage(e) {
        if(!this.mousedown) return;
        e.preventDefault();
        this.scrollDelta = this.initialX - e.pageX;
        this.id('calendarBody').scrollTo((this.scrollDelta + this.initialScrollX), 0);
    }
    updateCalendarPage(e) {
        e.preventDefault();
        if(this.mousedown) {
            let width = this.id('calendarBody').offsetWidth;
            if(this.scrollDelta > width / 2.5 && this.displayedCalendarPage < 59) {
                this.displayedCalendarPage += 1;
                this.displayedMonth += 1;              
                if(this.displayedMonth > 11) {
                    this.displayedMonth = 0; 
                    this.displayedYear += 1;
                    this.id('yearSlider').value = this.displayedYear;
                }
                this.id('monthSlider').value = this.displayedMonth;
            }
            else if((-1) * this.scrollDelta > width / 2.5 && this.displayedCalendarPage > 0) { 
                this.displayedCalendarPage -= 1;
                this.displayedMonth -= 1;
                if(this.displayedMonth < 0) {
                    this.displayedMonth = 11; 
                    this.displayedYear -= 1;
                    this.id('yearSlider').value = this.displayedYear;
                }
                this.id('monthSlider').value = this.displayedMonth;
            }
            if(Math.abs(this.scrollDelta) > 0) 
                this.id('calendarPage' + this.displayedCalendarPage).scrollIntoView({behavior: 'smooth'});           
            this.mousedown = false;
        }
    } 

    getCalendarPage(month, year) {
        return (Number(year) * 12 + Number(month));
    }
    selectDate(cell) {
        if(Math.abs(this.scrollDelta) > 5) return;
        if(!cell.currentMonth) { //handle prev or next month being selected
            if(cell.date > 15 && cell.i > 0) { //belongs to a previous month
                this.monthTable[cell.i-1].map((c) => {if(c.currentMonth && c.date === cell.date) cell = c;});
            }
            if(cell.date < 15 && cell.i < 59) { //belongs to the following month
                this.monthTable[cell.i+1].map((c) => {if(c.currentMonth && c.date === cell.date) cell = c;});
            }
            this.id('calendarPage' + cell.i).scrollIntoView({behavior: 'smooth'}); 
            this.displayedMonth = cell.month; 
            this.displayedYear = cell.year - Number(this.yearString[0]);
            this.id('monthSlider').value = this.displayedMonth;
            this.id('yearSlider').value = this.displayedYear;
        }
        this.selectedI = cell.i;
        this.selectedJ = cell.j;
        this.date = cell.date;
        this.month = cell.month;
        this.year = cell.year;
        this.dateObj = cell.dateObj;
        this.weekday = cell.weekday;
    }
    _firstRendered() {
        super._firstRendered();
        this.id('calendarPage' + this.selectedI).scrollIntoView();
    }
     _render() {
        return html`
        ${oneStyle}
        <style>
            /* local DOM styles go here */
            :host {
                display: block;
                color: #333;              
            }
            #calendar {
                position: relative;
                box-shadow: 0px 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.25);
                width: 100%; 
                max-width: 500px;
                min-width: 200px;
            }

            #calendarBody, #weekdays {
                position: relative;
                width: 100%; 
                overflow-x: hidden;
                display: flex; 
            }
            .weekdayCell, .cell {
                display:flex;
                background: white;
                justify-content: center;
                align-items: center;
                height: 8vh;              
                max-height:50px;
            }
            .weekdayCell {
                background: var(--one-color, #333);
                color: white;
                flex: 1;
            }
            .calendarPage { 
                min-width: 100%;  
                display: flex;                 
                z-index: 0;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
            }
            .cell {
                width:14.28%;
                height: 8vh;
                -webkit-transition: background .5s ease;
                -moz-transition: background .5s ease;
                border-radius: 100%;
                cursor: pointer;
            }            
            .cell[selected=true] .date, .date:hover {
                background: var(--one-color, #333);
                color: white;
            }  
            .cell:hover {
                opacity: 0.5;                
            } 
            .cell:active {
                opacity: 1
            }                     
            .cell[currentMonth=false] .date {
                color: #bbb;
            }
            .date {
                width: 8vh;
                height: 8vh;
                border-radius: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #sliderSelection { 
                position: absolute;       
                top:30%;
                height: 30%;
                width: 100%;
                background: rgba(100, 100, 100, 0.7);                
                color: white;
                font-style: italic !important; 
                font-size: 300%;
                text-align: center;  
                line-height: 100%;
                vertical-align: middle;        
                padding-top: 10%; 
            }
            .sliderBox {
                display: flex;
                align-items: center;
                justify-content: space-around; 
                padding: 0 10px 0 10px;                             
            }
            #monthSlider, #yearSlider {
                flex: 2;
                margin: 0 10px 0 10px;
            }
            h2 {
                flex: 1;
                text-align: center;
                min-width: 100px;
                font-size: 120%;
                color: #888;
            }
        </style>

        
        <div id="calendar">
            <div class="sliderBox">
                <h2>${this.monthString[this.displayedMonth]}</h2>
                <input type="range"  min="0" max="11" id="monthSlider"
                    @input=${(e)=>{this.scrollCalendarPage(e)}}
                    @mouseup=${(e)=>{this.id('sliderSelection').hide()}} @touchend=${(e)=>{this.id('sliderSelection').hide()}}                    
                    value=${this.displayedMonth}>
            </div>
            <div id="weekdays">${this.weekdayString.map((i) => html`<div class="weekdayCell">${i.slice(0, 3)}</div>`)}</div>
            
            <div id="calendarBody"  
                @mousedown=${(e)=>{this.setupDrag(e)}}        @touchstart=${(e)=>{this.setupDrag(e)}}
                @mousemove=${(e)=>{this.dragCalendarPage(e)}} @touchmove=${(e)=>{this.dragCalendarPage(e)}}
                @mouseup=${(e)=>{this.updateCalendarPage(e)}} @touchend=${(e)=>{this.updateCalendarPage(e)}}>
                ${this.monthTable.map((cells, index) => 
                    html`<div class="calendarPage" id=${'calendarPage' + index}>
                        ${cells.map((cell) => html`<div class="cell" currentMonth=${cell.currentMonth} i=${cell.i}
                            selected=${cell.i === this.selectedI && cell.j === this.selectedJ ? true : false} 
                            @click=${(e)=>{this.selectDate(cell)}}><div class="date">${cell.date}</div></div>`)}
                    </div>`)}                
            </div>
            <one-block id="sliderSelection" .visible=${false}>
                ${this.sliderSelection}
            </one-block>
            <div class="sliderBox" style="border-top: 1px solid #ddd">
                <h2>${this.yearString[this.displayedYear]}</h2>
                <input type="range" min="0" max="4" id="yearSlider"
                    @input=${(e)=>{this.scrollCalendarPage(e)}}
                    @mouseup=${(e)=>{this.id('sliderSelection').hide()}} @touchend=${(e)=>{this.id('sliderSelection').hide()}}                    
                    value=${this.displayedYear}>
            </div>        
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
     _render() {return html`<slot></slot>`;}
}
customElements.define('one-block', OneBlock);
