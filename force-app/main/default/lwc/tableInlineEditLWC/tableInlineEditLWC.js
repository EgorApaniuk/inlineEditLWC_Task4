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
    receivedId;
    receivedDraft;
    dataArray;
    indexVar;
    openFooter;

    columns = [
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

    @wire(getAccounts)
    refreshWiredAccounts(value) {
        this.wiredAccounts = value;
        const {data, error} = value;
        if (data) {
            this.data=data;
            this.dataArray = data;
            console.log(JSON.stringify(data));
        }
        else if (error) {  //ensert toast event here
            console.log(error);
        }
    }

    handleFocusLost(event){
        console.log("FOCUS LOST EVENT CATCHED IN MAIN PARENT COMPONENT");
        this.receivedDraft = event.detail.draft;
        console.log("draft = " + this.receivedDraft);
        this.receivedId = event.detail.id;
        this.indexFind();
        this.checkRating();
        
    }
    
    indexFind() {
        this.indexVar = this.dataArray.findIndex((array) => {
            return array.Id == this.receivedId;
        });
        console.log(this.indexVar);
    }

    checkRating() {
        if (this.receivedDraft == this.dataArray[this.indexVar].Rating                               // NO changes in rating  
            || (this.dataArray[this.indexVar].Rating == undefined && this.receivedDraft == "")) {    // or change from None to None 
            const message = {
                changes: false,
            };
            publish(this.messageContext, SAMPLEMC, message);
        } else { 
            console.log("there ARE changes in rating");    
            const message = {
                changes: true,
                id : this.receivedId,
                draft : this.receivedDraft
            };
            publish(this.messageContext, SAMPLEMC, message); 
            this.openFooter = true;
        }
    }



    handleSave() { 
        console.log("savePusheed");
        this.openFooter = false;
    }

    handleCancel() {
        console.log("cancel Pusheed");
        this.openFooter = false;
        const message = {
            cancel: true,
            id: this.receivedId,
            stockRating: this.dataArray[this.indexVar].Rating
        };
        publish(this.messageContext, SAMPLEMC, message);
        console.log("cancel message published ");

        this.receivedDraft = [];

        // this.workingWithRating ? (
        //     this.template.querySelector('[data-id=\'' + this.receivedId + '\']').throwRating = this.dataArray[this.indexVar].Rating
        // ) : (
        //     this.template.querySelector('[data-id=\'' + this.receivedId + '\']').throwName = this.dataArray[this.indexVar].Name
        // );

        // changeBackgroudColorToDefault
    }



    
    handleClick() {
        const message = {
            blockButtons : false
        };
        publish(this.messageContext, SAMPLEMC, message);
    }
}