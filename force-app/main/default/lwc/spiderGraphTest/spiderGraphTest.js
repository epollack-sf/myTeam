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
                labels: ['Other', 'Consulting', 'Sales', 'Great Characteristics', 'Product', 'Discipline', 'Industry', 'Solution Engineering', 'Technical', 'Customer Engagement'],
                datasets: [{
                    label: '# of Votes',
                    data: [100, 19, 25, 40, 32, 57, 86, 15, 5, 10],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    r: {
                        grid: {
                            circular: true
                        }
                    }
                }
            }
        });
    }

    /*displayTest(){
        console.log(JSON.stringify(this.testContacts));
    }*/
}