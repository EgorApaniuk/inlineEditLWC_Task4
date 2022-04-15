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
        {label: 'Delete', fieldName: 'Delete', fixedWidth: 90, type: 'button-icon', name: 'delete',
        typeAttributes: {iconName: 'utility:delete', title: 'Delete'}}
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


    handleRefreshTable() { // for immidiate table refresh after deleting row
        refreshApex(this.wiredAccounts);
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
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.receivedId;
        fields[RATING_FIELD.fieldApiName] = this.receivedDraft;
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Saved successfully',
                        variant: 'success'
                    })
                )
                this.handleRefreshTable();
            }).
            catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Deletion failed',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        this.openFooter = false;  

        const message = {
            blockButtons : false
        };
        publish(this.messageContext, SAMPLEMC, message);
    }

    handleCancel() {
        this.openFooter = false;
        const message = {
            cancel: true,
            id: this.receivedId,
            stockRating: this.dataArray[this.indexVar].Rating,
            blockButtons : false
        };
        publish(this.messageContext, SAMPLEMC, message);
        this.receivedDraft = [];
        // changeBackgroudColorToDefault
    }


    
    handleRowAction(event){
        const action = event.detail.action;
        const row = event.detail.row;    
        console.log("handleRowAction", JSON.stringify(action), JSON.stringify(row));
        action.title == 'Delete' ? this.handleDelete(row) : null;
    }

    handleDelete(row) {
        console.log("handleDelete started");
        console.log("acc to delete id is: ", row.Id);
        deleteAccount({ accountId: row.Id }).then(() => {
            this.handleRefreshTable();
        }).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'deleted successfully',
                    variant: 'success'
                })
            )

        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: 'error.body.message',
                    variant: 'error'
                })
            );
        });
    }


    
    handleClick() {
        const message = {
            blockButtons : false
        };
        publish(this.messageContext, SAMPLEMC, message);
    }
}