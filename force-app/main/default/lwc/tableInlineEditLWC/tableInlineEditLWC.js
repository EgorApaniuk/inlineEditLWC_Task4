import { LightningElement, track, wire } from 'lwc';
import { refreshApex} from '@salesforce/apex';
import {getFieldValue, updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import RATING_FIELD from '@salesforce/schema/Account.Rating';

import { publish, MessageContext } from 'lightning/messageService';
import SAMPLEMC from '@salesforce/messageChannel/SampleMessageChannel__c';

export default class TableInlineEditLWC extends LightningElement {

    @wire(MessageContext)
    messageContext;

    @track data;
    wiredAccounts;
    showEdit = true; // by default edit visible
    receivedId;

    columnsEditable = [
        {label: 'Name', fieldName: 'Name', type: 'text', editable: true},
        {   label: 'Rating', 
            fieldName: 'Rating', 
            type: 'customCell',
            typeAttributes: {recordId: {fieldName: ID_FIELD.fieldApiName},
                             value: {fieldName: RATING_FIELD.fieldApiName},
                             showEdit: true
                            }
        }, 
        {label: 'Delete', fieldName: 'Delete', fixedWidth: 90, type: 'button-icon', 
        typeAttributes: {iconName: 'utility:delete', title: 'Delete', onclick:'handleDelete'}}
    ];

    columnsNonEditable = [
        {label: 'Name', fieldName: 'Name', type: 'text', editable: false},
        {   label: 'Rating', 
            fieldName: 'Rating', 
            type: 'customCell',
            typeAttributes: {recordId: {fieldName: ID_FIELD.fieldApiName},
                             value: {fieldName: RATING_FIELD.fieldApiName},
                             showEdit: false,
                            }
        }, 
        {label: 'Delete', fieldName: 'Delete', fixedWidth: 90, type: 'button-icon', 
        typeAttributes: {iconName: 'utility:delete', title: 'Delete', onclick:'handleDelete'}}
    ];


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

    handleUnableButtonsEvent(event){
        console.log("UNABLE BUTTONS EVENT CATCHED");
        this.receivedId = event.detail.id;
        console.log("полученное id "+this.receivedId);
        this.showEdit = false;
        console.log(this.showEdit);
        this.template.querySelector('[data-id=\'' + this.receivedId + '\']')./* showSelect */this.editRatingButtonClicked = true;
    }

    handleDelete(){
        console.log("delete pushed");
    }

    handleClick(){
        const message = {
            recordId: '001xx000003NGSFAA4',
            message : "YEET",
            source: "LWC",
            recordData: {accountName: 'Burlington Textiles Corp of America'}
        };
        publish(this.messageContext, SAMPLEMC, message);
    }
}