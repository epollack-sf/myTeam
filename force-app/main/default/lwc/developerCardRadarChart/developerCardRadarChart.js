import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJS from '@salesforce/resourceUrl/ChartJS';
// import SalesforceSans from '@salesforce/resourceUrl/SalesforceSans';

const MAX_LEVEL = 5;

export default class DeveloperCardRadarChart extends LightningElement {
    @api skills; // expected to be an array of Skill objects: {id: '', Type__c: '', Category__c: '', Name: '', Rating__c: 2}

    get data() {
        const formattedData = [];
        
        const top8Categories = this.getTop8Categories(this.skills);
        const skillsInTop8 = this.skills.filter(skill => top8Categories.includes(skill.Category__c));
        
        for (let category of top8Categories) {
            formattedData.push({ category: category, ratio: this.getRatingPercentage(skillsInTop8, category) });
        }
        
        return formattedData;
    }

    renderedCallback() {
        /*const sfSans = new FontFace(
            'Salesforce Sans-Regular',
            `url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)`
        );

        console.log(JSON.stringify(sfSans));

        this.template.fonts.add(sfSans);

        console.log('break');

        Promise.all([
            loadScript(this, `${ChartJS}/chart.js`), 
            sfSans.load()
        ])*/


        loadScript(this,`${ChartJS}/chart.js`)
            .then(() => this.initializeChart())
            .catch(e => console.error('Failed to load chart', e.message));
    }

    initializeChart() {
        const ctx = this.template.querySelector('canvas');
        const config = {
            type: 'radar',
            data: {
                labels: [...this.data.map(entry => entry.category)],
                datasets: [{
                    label: 'Total rating/Maximum possible rating by Category',
                    data: [...this.data.map(entry => entry.ratio)],
                    borderColor: 'rgb(216, 58, 0, 0.8)',
                    backgroundColor: 'rgba(88, 103, 232, 0.7)',
                }]
            },
            options: {
                animations: {
                    /*tension: {
                        duration: 1000,
                        easing: 'easeInOutElastic',
                        from: 1,
                        to: 0,
                        loop: true
                    }*/
                },
                scales: {
                    r: {
                        angleLines: {
                            color: '#FE9339'
                        },
                        grid: {
                            circular: true
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: 'sans-serif'
                            }
                        }
                    }
                }
            }
        }

        new Chart(ctx, config);
    }

    getTop8Categories(skills) {
        const totalCategories = skills.map(skill => skill.Category__c);
        const uniqueCategories = Array.from(new Set(totalCategories));
        
        if (uniqueCategories.length > 8) {
            const counts = [];
            
            for (let category of uniqueCategories) {
                counts.push({ category: category, count: totalCategories.filter(c => c === category).length });
            }
            counts.sort((a, b) => b.count - a.count);
            
            return counts.map(o => o.category).slice(0, 8);
        }

        return uniqueCategories;
    }

    getRatingPercentage(skills, category) {
        const entriesByCategory = skills.filter(skill => skill.Category__c === category);
        let numEntries = entriesByCategory.length;
        let sumRatings = entriesByCategory.map(skill => skill.Rating__c).reduce((acc, currVal) => acc + currVal, 0);

        return (sumRatings / (MAX_LEVEL * numEntries)) * 100;
    }
}