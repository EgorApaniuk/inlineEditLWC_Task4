import { LightningElement, api } from 'lwc';

export default class CustomCell extends LightningElement {
    @api recordId;
    @api showRating;
    @api editRatingButtonClicked = false;

    @api unableButtons() {
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.setAttribute('disabled', true);
        editRatingButton.setAttribute('disabled', true);
    }

    renderedCallback() {
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.showRating : null;
    }

    handleEditRating() {
        console.log("edit rating button pushed");
        this.editRatingButtonClicked = true; // show rating select, hide rating text
        this.unableButtonsMessage();
    }

    unableButtonsMessage() {
        const unableButtonsEvent = new CustomEvent("unablebuttonsevent", {
            composed: true,
            bubbles: true
        });
        this.dispatchEvent(unableButtonsEvent);
    }

    handleFocusLostEvent() {
        console.log("focus lost");
        const focuslost = new CustomEvent("focuslost", {
            composed: true,
            bubbles: true
        });
        this.dispatchEvent(focuslost);
    }
}