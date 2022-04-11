import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
import { refreshApex} from '@salesforce/apex';
import {getFieldValue, updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import RATING_FIELD from '@salesforce/schema/Account.Rating';

const COLUMNS = [
    {label: 'Name', fieldName: 'Name', type: 'text', editable: true},
    {label: 'Rating', fieldName: 'Rating', type: 'text', editable: true},
    {label: 'Delete', fieldName: 'Delete'}
];

export default class TableInlineEditLWC extends LightningElement {
    @track dat; 
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
}