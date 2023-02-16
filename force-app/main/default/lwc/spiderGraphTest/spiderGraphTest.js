import { LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJS from '@salesforce/resourceUrl/ChartJS';

/*
import { getRecords } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
*/

export default class SpiderGraphTest extends LightningElement {
    /*@wire(getRecords, {
        records: {
            recordIds: ['003Dn000007J3I8IAK', '003Dn000007J3IFIA0', '003Dn000007J3IIIA0'],
            fields: [NAME_FIELD]
        }
    }) testContacts;*/
    
    renderedCallback() {
        loadScript(this, `${ChartJS}/chart.js`)
            .then(() => this.initializeSpiderChart())
            .catch((e) => console.error('Failed to load chart.js', e.message));
    }

    initializeSpiderChart() {
        const ctx = this.template.querySelector('canvas');

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Indigo', 'Violet', 'Cheese'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 1, 5, 15],
                    borderWidth: 1
                }]
            },
        });
    }

    /*displayTest(){
        console.log(JSON.stringify(this.testContacts));
    }*/
}