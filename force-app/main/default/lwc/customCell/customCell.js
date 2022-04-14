import { LightningElement, wire, api } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";

import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c";

export default class CustomCell extends LightningElement {
    @api recordId;
    @api showRating;
    @api editRatingButtonClicked = false;
    @api showEdit;

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
        this.handleMessage(message);
      },
      { scope: APPLICATION_SCOPE }
    );
  }

  unsubscribeMC() {
    unsubscribe(this.subscription);
    this.subscription = null;
    this.isDisabled = false;
    this.isDisabledUnsb = true;
  }

  handleMessage(message) {
    this.receivedMessage = message
      ? JSON.stringify(message, null, "\t")
      : "no message payload";
  }



    @api unableButtons() {
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editRatingButton.setAttribute('disabled', true);
    }

    renderedCallback() {
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.showRating : null;
    }

    handleEditRating() {
        console.log("edit rating button pushed");
        const unableButtonsEvent = new CustomEvent("unablebuttonsevent", {
            composed: true,
            bubbles: true,
            detail: {"id":this.recordId}
        });
        console.log("отправленое id "+ this.recordId);
        this.dispatchEvent(unableButtonsEvent);


        // this.editRatingButtonClicked = true; // show rating select, hide rating text
        // let editRatingButton = this.template.querySelector('.editRatingButton');
        // editRatingButton.setAttribute('disabled', true);
    }

    // unableButtonsMessage() {
    //     const unableButtonsEvent = new CustomEvent("unablebuttonsevent", {
    //         composed: true,
    //         bubbles: true
    //     });
    //     this.dispatchEvent(unableButtonsEvent);
    // }

    handleFocusLostEvent() {
        console.log("focus lost");
        const focuslost = new CustomEvent("focuslost", {
            composed: true,
            bubbles: true
        });
        this.dispatchEvent(focuslost);
    }
}