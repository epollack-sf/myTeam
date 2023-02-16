import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CHARTJS from '@salesforce/resourceUrl/ChartJS';

const MAX_LEVEL = 5;
export default class DeveloperCardRadarChart extends LightningElement {
    @api skills; // expected to be am array of objects 
    // {id: '', Type__c: '', Category__c: '', Name: '', Rating__c: 2}

    get top8Categories() {
        let totalCategories = this.skills.map(skill => skill.Category__c);
        let uniqueCategories = Array.from(new Set(totalCategories));
        
        if (uniqueCategories.length <= 8) {
            return uniqueCategories;
        } else {
            let counts = [];
            
            for (category of uniqueCategories) {
                counts.push({ category: category, count: totalCategories.filter(c => c === category).length });
            }
            counts.sort((a, b) => b.count - a.count);
            
            return counts.map(o => o.category).slice(0, 8);
        }
    }

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
                labels: [...this.top8Categories],
                datasets: [{
                    label: 'Ratio Description',
                    data: [],
                }]
            }
        });
    }
}