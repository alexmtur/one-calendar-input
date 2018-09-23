import {OneClass, html} from '@alexmtur/one-class'
import {OneIcon} from '@alexmtur/one-icon'
import {oneStyle} from '@alexmtur/one-style'

export class OneTodoList extends OneClass {
    static get properties() {return {
        list: {type: Array, public: true},
        newItem: String,
        //suggestions: Array,
    }}
    constructor() {
        super();  
        this.list = [];
        this.newItem = '';
        //this.suggestions = [];
    }
    addItem () {
        if(!this.newItem) return;
        let item = {'value': this.newItem, 'done': false};
        this.list.push(item);
        this.newItem = '';
    }
    toggleSelected (index) {
        this.list[index].done = !this.list[index].done;
        this.list = this.list.slice(); //to request render, optimize this!
    }
     _render() {
        return html`
        ${oneStyle}
        <style>
            /* local DOM styles go here */
            :host {
                display: block;
                width: 100%;
            }
            .add-icon {
                font-size: 20px;
                margin-left: 10px;
                background: var(--one-color, #333);
                fill: white;
            }
            .task-row {
                margin-top: 10px;
                cursor: pointer;
            }
            .task {
                font-size: 16px;
                color: #333333;
                transition: all .5s;
            }
            
            .task[selected=true] {
                color: #aaaaaa;
                text-decoration: line-through;
            }
            .checkbox {
                height: 20px;
                width: 20px;
                border: solid 1px;
                border-color: var(--one-color, #333);
                border-radius: 20px;
                background: transparent;
                transition: all .5s;
                margin-right: 10px;
            }
            .checkbox[selected=true] {
                background: var(--one-color, #333);
            }
            input {
                background: white !important;
                border: solid 1px var(--one-color, #333) !important;
                color: #333333;
                font-family: 'Open Sans';
                font-size: 16px;
                display: inline-block;
                /*border-radius: 20px;*/
                text-align: center;
                line-height: 35px;
                min-width: 100px;
            }
            input:focus {
                outline: none;
            }
            input[type=text] {
                width: 100%;
                max-width: 350px;
            }

        </style>

        <div width="100%">
            <div>
                <input type="text" placeholder="New Item" on-change=${(e)=>{this.newItem = e.target.value;}} value=${this.newItem}>
                <one-icon icon="add" class="add-icon" on-click="${(e) => this.addItem()}"></one-icon> 
            </div>
        </div>
        ${this.list.map((item, index) => html`
            <one-block align="center-left" width="100%" class="task-row" on-click=${(e)=>{this.toggleSelected(index);}}>
                <div class="checkbox" selected$=${item.done}></div>
                <one-block weight="1">
                    <div class="task" selected$=${item.done}>${item.value} and ${item.done}</div>
                </one-block>
            </one-block>`)}
        `;}
}
customElements.define('one-todo-list', OneTodoList);
