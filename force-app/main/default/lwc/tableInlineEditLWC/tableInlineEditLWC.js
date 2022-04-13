import { LightningElement, track, wire } from 'lwc';
import { refreshApex} from '@salesforce/apex';
import {getFieldValue, updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import RATING_FIELD from '@salesforce/schema/Account.Rating';

const COLUMNS = [
    {label: 'Name', fieldName: 'Name', type: 'text', editable: true},
    {   label: 'Rating', 
        fieldName: 'Rating', 
        type: 'customCell',
        typeAttributes: { recordId: {fieldName: ID_FIELD.fieldApiName},
                          value: {fieldName: RATING_FIELD.fieldApiName} }
    }, 
    {label: 'Delete', fieldName: 'Delete', fixedWidth: 90, type: 'button-icon', 
    typeAttributes: {iconName: 'utility:delete', title: 'Delete', onclick:'handleDelete'}}
];

export default class TableInlineEditLWC extends LightningElement {
    @track data;
    columns = COLUMNS;
    wiredAccounts;

    @wire(getAccounts)
    refreshWiredAccounts(value){
        this.wiredAccounts = value;
        const {data, error} = value;
        if(data){
            this.data=data;
            console.log(JSON.stringify(data));
        }
        else if (error) {  //ensert tost event here
            console.log(error);
        }
    }

    handleFocusLost(){
        console.log("FOCUS LOST EVENT CATCHED IN MAIN PARENT COMPONENT");
    }

    handleUnableButtonsEvent(){
        console.log("UNABLE BUTTONS EVENT CATCHED");
    }
    handleDelete(){
        console.log("delete pushed");
    }
}