import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJS from '@salesforce/resourceUrl/ChartJS';

export default class SpiderGraphTest extends LightningElement {
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
}