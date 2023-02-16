import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CHARTJS from '@salesforce/resourceUrl/ChartJS';

const MAX_LEVEL = 5;
export default class DeveloperCardRadarChart extends LightningElement {
    @api skills; // expected to be an array of Skill objects 
                // {id: '', Type__c: '', Category__c: '', Name: '', Rating__c: 2}
    
    get data() {
        let formattedData = [];
        
        let top8Categories = this.getTop8Categories(this.skills); // array of categories <string>
        let skillsInTop8 = this.skills.filter(skill => top8Categories.includes(skill.Category__c));
        
        for (category of top8Categories) {
            formattedData.push({ category: category, ratio: this.getRatingPercentage(skillsInTop8, category) });
        }

        return formattedData;
    }

    renderedCallback() {
        loadScript(this, `${CHARTJS}/chart.js`)
            .then(() => this.initializeChart())
            .catch(e => console.error('Failed to load chart.js', e.message));
    }

    initializeChart() {
        const ctx = this.template.querySelector('canvas');

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [...this.data.map(entry => entry.category)],
                datasets: [{
                    label: '% of ',
                    data: [...this.data.map(entry => entry.ratio)],
                }]
            }
        });
    }

    getTop8Categories(skills) {
        let totalCategories = skills.map(skill => skill.Category__c);
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

    getRatingPercentage(skills, category) {
        let entriesByCategory = skills.filter(skill => skill.Category__c === category);
        let numEntries = entriesByCategory.length;
        let sumRatings = entriesByCategory.map(skill => skill.Rating__c).reduce((acc, currVal) => acc + currVal, 0);

        return sumRatings / (MAX_LEVEL * numEntries);
    }

    /*get ratingPercentage() {
        let skillsInTop8 = this.skills.filter(skill => this.top8Categories.includes(skill.Category__c));
        let useableData = [];
        for (category of this.top8Categories) {
            let entriesByCategory = skillsInTop8.filter(skill => skill.Category__c === category);
            let numEntries = entriesByCategory.length;
            let sumRatings = entriesByCategory.map(skill => skill.Rating__c).reduce((acc, currVal) => acc + currVal, 0);

            useableData.push({ category: category, ratio: sumRatings / (MAX_LEVEL * numEntries) })
        }

        return useableData;
    }*/
}