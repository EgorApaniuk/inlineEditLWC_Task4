import { LightningElement, wire, api } from "lwc";
import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from "lightning/messageService";

import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c";
import { getDataConnectorTypes } from "lightning/analyticsWaveApi";

export default class CustomCell extends LightningElement {
    @api recordId;
    @api showRating;
    @api editRatingButtonClicked = false;
    @api showEdit;
    isDisabledEdit = false;
    ratingTempStorage;


    @wire(MessageContext) // what is message context?
    messageContext;

    subscription = null;
    receivedMessage;
    isDisabled = false;
    isDisabledUnsb = true;



    subscribeMC() {
        this.isDisabled = true;
        this.isDisabledUnsb = false;
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            SAMPLEMC,
            message => {
                console.log("message in subscriber ", message);
                message.cancel ? this.handleCancel(message): null;
                message.blockButtons ? this.isDisabledEdit = true : null;  //  on/off edit buttons 
                message.blockButtons == false ? this.isDisabledEdit = false : null;
                message.changes ? this.handleChanges(message) : null;
                message.changes == false ?  this.handleStatusQuo(): null;
                // this.handleChanges(message);
            },
            { scope: APPLICATION_SCOPE }
        );
    }

    connectedCallback() {
        this.subscribeMC(); // every CustomCell subscribed on MC by default.  ok?
    }

    renderedCallback() {
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.showRating : null;
    }



    unsubscribeMC() {
        unsubscribe(this.subscription);
        this.subscription = null;
        this.isDisabled = false;
        this.isDisabledUnsb = true;
    }

    handleCancel(message) {
        console.log("handleCancel activated")

        if (message.id == this.recordId) {
            console.log("handleCancel activated", this.showRating);

            console.log("handleCancel activated", message.stockRating);

            this.showRating = message.stockRating;
            // this.changeBackgroundToDefault()
        }
    }

    handleStatusQuo(){
        this.editRatingButtonClicked = false;
        this.isDisabledEdit = false;
    }

    handleChanges(message) {

        // // this.template.querySelector('[data-id=\'' + this.receivedId + '\']').editRatingButtonClicked = false;
        if (message.id == this.recordId) {
            console.log("handleChanges in CustomCell");
            this.editRatingButtonClicked = false;
            this.showRating = message.draft;
        }

        //     console.log('.select = ', this.template.querySelector('.select'));
        //     console.log('edit rating = ', this.editRatingButtonClicked);
        //     let tempRatingVar = this.template.querySelector('.select').value;
        //     console.log(" this.changeBackgroundColor();");
        //     this.editRatingButtonClicked = false;
        //     this.showRating = tempRatingVar;
        // }
        // else {
        //     console.log("handling no changes");
        // }
    }


    changeBackgroundColor() {
        if (this.editRatingButtonClicked) {
            this.template.querySelector(".fieldrating").classList.toggle("input-changed", false);   // красим рейтинг 
            this.template.querySelector(".fieldrating").classList.toggle("yellow-cell", true);
        } else {
            this.template.querySelector(".fieldname").classList.toggle("input-changed", false);     // красим имя
            this.template.querySelector(".fieldname").classList.toggle("yellow-cell", true);
        }
    }





    handleEditRating() {
        this.ratingTempStorage = this.showRating;
        console.log("___ratingTempStorage storages: ",this.ratingTempStorage);
        const message = {
            blockButtons: true
        }
        publish(this.messageContext, SAMPLEMC, message);
        this.editRatingButtonClicked = true; // show rating select, hide rating text
    }

    handleFocusLostEvent() {
        const focuslost = new CustomEvent("focuslost", {
            composed: true,
            bubbles: true,
            detail: {
                "id": this.recordId,
                "draft": this.template.querySelector('.select').value
            }
        });
        this.dispatchEvent(focuslost);
    }
}