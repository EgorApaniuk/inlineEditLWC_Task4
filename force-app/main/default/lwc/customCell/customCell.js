import { LightningElement, wire, api } from "lwc";
import {
    publish,
    subscribe,
    APPLICATION_SCOPE,
    MessageContext
} from "lightning/messageService";
import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c";

export default class CustomCell extends LightningElement {

    @wire(MessageContext) // what is message context?
    messageContext;
    @api recordId;
    @api showRating;
    editRatingButtonClicked = false;
    isDisabledEdit = false;
    ratingTempStorage;
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
                message.paintCellToYellow ? this.template.querySelector(".focusedCell").classList.toggle("editedCell", false) : null; // painting rating to default
                message.cancel ? this.handleCancel(message): null;
                message.blockButtons ? this.isDisabledEdit = true : null;  //  on/off edit buttons 
                message.blockButtons == false ? this.isDisabledEdit = false : null;
                message.changes ? this.handleChanges(message) : null;
                message.changes == false ? this.handleStatusQuo(): null;
            },
            { scope: APPLICATION_SCOPE }
        );
    }

    connectedCallback() {
        this.subscribeMC(); // every CustomCell subscribed on MessageChannel by default.
    }

    renderedCallback() {
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.showRating : null;
    }

    handleCancel(message) {
        if (message.id == this.recordId) {
            this.showRating = message.stockRating;
            this.template.querySelector(".focusedCell").classList.toggle("editedCell", false);   // painting rating to default
        }
    }

    handleStatusQuo() {
        this.editRatingButtonClicked = false;
        this.isDisabledEdit = false;
    }

    handleChanges(message) {
        if (message.id == this.recordId) {
            this.template.querySelector(".focusedCell").classList.toggle("editedCell", true);   // painting rating 
            this.editRatingButtonClicked = false;
            this.showRating = message.draft;
        }
    }

    handleEditRating() {
        this.ratingTempStorage = this.showRating;
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