import LightningDatatable from 'lightning/datatable';
import customCellTemplate from './customCellTemplate.html';
 
export default class CustomDatatable extends LightningDatatable {
    
    static customTypes = {
        customCell: {
            template: customCellTemplate,
            typeAttributes: ['recordId', 'rating']
        }
    };
    
    // handleFocusLost(){
    //     console.log("EVENT CATCHED IN CUSTOM DATATABLE");
    // }
    
}