import {OneClass, html} from '@alexmtur/one-class'
import {oneStyle} from '@alexmtur/one-style'

export class OneClockInput extends OneClass {
    static get properties() {return {
        hour: {type: Number, public: true},     //0 - 23 
        minute: {type: Number, public: true},   //0 - 59 
        amPm: {type: String, public: true},     //am - pm
    }}
    constructor() {
        super();  
        this.clockHours = [];
        this.clockMinutes = [];
        this.setupClock();
    }
    setupClock() {
        let dateObj = new Date();
        dateObj.setHours(dateObj.getHours() + 1);
        this.hour = dateObj.getHours();
        if(this.hour >= 12) this.amPm = 'pm'; else this.amPm = 'am';
        this.minute = 0;
        
        let amHourCells = [];
        let pmHourCells = [];
        let minuteCells = [];
        for (let i = 0; i < 12; i++) {
            amHourCells[i] = {};
            pmHourCells[i] = {};
            minuteCells[i] = {};
            amHourCells[i].hourValue = i;
            amHourCells[i].hourString = String(i);
            amHourCells[i].amPm = 'am';
            pmHourCells[i].hourValue = i + 12;
            pmHourCells[i].hourString = String(i + 12);
            pmHourCells[i].amPm = 'pm';
            minuteCells[i].minuteValue = i * 5;
            minuteCells[i].minuteString = String(i * 5);
            if(i < 2) {
                minuteCells[i].minuteString = '0' + minuteCells[i].minuteString;
            }
            if(i < 10) {
                amHourCells[i].hourString = '0' + amHourCells[i].hourString;
            }
            
        }
        this.clockHours[0] = amHourCells;
        this.clockHours[1] = pmHourCells;
        this.clockMinutes = minuteCells;
    }
    selectHour(hourCell) {
        this.hour = hourCell.hourValue;
        this.amPm = hourCell.amPm;
        console.log('here');
    }
    selectMinute(minuteCell) {
        this.minute = minuteCell.minuteValue;
    }
    selectAmPm(amPm) {
        this.amPm = amPm;
        if(amPm === 'am' && this.hour >= 12) this.hour -= 12;
        else if(amPm === 'pm' && this.hour <= 12) this.hour += 12;
        this.id('calendarPage' + amPm).scrollIntoView({behavior: 'smooth'});
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
    _firstRendered() {
        super._firstRendered();
        this.id('calendarPage' + this.amPm).scrollIntoView();
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
                display: flex;                
                width: 100%; 
                max-width: 500px;
                min-width: 200px;
            }

            #calendarBody, #weekdays {
                width: 100%; 
                overflow-x: hidden;
                display: flex; 
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.25);
            }
            #amPm {
                display: flex; 
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.25);
            }
            .amPmButton {

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
            .blink {
                animation: blink 1s step-start 0s infinite;
            }
            @keyframes blink {
              50% {
                opacity: 0;
              }
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
                width:33%;
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
            <div id="amPm">
                <div class="amPmButton" @click=${(e)=>{this.selectAmPm('am')}}>am</div>  
                <div class="amPmButton" @click=${(e)=>{this.selectAmPm('pm')}}>pm</div> 
            </div>  
            <div id="calendarBody">
                ${this.clockHours.map((hourCells, index) => 
                    html`<div class="calendarPage" id=${'calendarPage' + hourCells[0].amPm}>
                        ${hourCells.map((hourCell) => html`<div class="cell"
                            selected=${hourCell.hourValue === this.hour && hourCell.amPm === this.amPm ? true : false} 
                            @click=${(e)=>{this.selectHour(hourCell)}}><div class="date">${hourCell.hourString}</div></div>`)}
                    
                    </div>`)}              
            </div>
            <div class="blink" style="display: flex; align-items: center; justify-content: center; flex-direction: column">
                <div style="height: 10px; width: 10px; background: blue; margin:10px; border-radius: 100%">
                </div>
                <div style="height: 10px; width: 10px; background: blue; margin:10px; border-radius: 100%">
                </div>
            </div>
            <div id="calendarBody">
                <div class="calendarPage">
                        ${this.clockMinutes.map((minuteCell) => html`<div class="cell"
                            selected=${minuteCell.minuteValue === this.minute ? true : false} 
                            @click=${(e)=>{this.selectMinute(minuteCell)}}><div class="date">${minuteCell.minuteString}</div></div>`)}
                </div>                
            </div>     
        </div>
        `;}
}
customElements.define('one-clock-input', OneClockInput);


