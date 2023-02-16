import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CHARTJS from '@salesforce/resourceUrl/ChartJS';

export default class DeveloperCardRadarChart extends LightningElement {
    @api skills; // expected to be am array of data
    
    renderedCallback() {
        loadScript(this, `${CHARTJS}/chart.js`)
            .then(() => this.initializeChart())
            .catch((e) => console.error('Failed to load chart.js', e.message));
    }

    initializeChart() {
        const ctx = this.template.querySelector('canvas');

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Ratio Description',
                    data: [],
                }]
            }
        });
    }
}