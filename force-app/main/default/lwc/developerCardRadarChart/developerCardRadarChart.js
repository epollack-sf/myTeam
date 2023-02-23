import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJS from '@salesforce/resourceUrl/ChartJS';

const MAX_LEVEL = 5;

export default class DeveloperCardRadarChart extends LightningElement {
    @api employee; // User object to extract info from
    _data;
    
    @api
    set skills(value) { // expected to be an array of Skill objects: {id: '', Type__c: '', Category__c: '', Name: '', Rating__c: 2}
        const formattedData = [];
        const top8Categories = this.getTop8Categories(value);
        const skillsInTop8 = value.filter(skill => top8Categories.includes(skill.Category__c));
        
        for (let category of top8Categories) {
            formattedData.push({ category: category, ratingInfo: this.getRatingPercentage(skillsInTop8, category) });
        }
        
        this._data = formattedData;
    }

    get skills() {
        return this._data;
    }

    renderedCallback() {
        loadScript(this,`${ChartJS}/chart.js`)
            .then(() => this.initializeChart())
            .catch(e => console.error('Failed to load chart', e.message));
    }


    // Add constants to store reused RGBA/color info
    initializeChart() {
        // Callbacks
        const getEveryEvenTick = function(v, i) {
            return i % 2 === 0 ? this.getLabelForValue(v) : '';
        };

        const tooltipDescription = (tooltipItems) => {
            const categoryData = this.skills.find(skill => skill.category === tooltipItems[0].label);

            return `Number of Skills in Category: ${categoryData.ratingInfo.numEntriesInCategory}\n` +
                `Total Score in Category: ${categoryData.ratingInfo.sumRatingsInCategory}\n` +
                `Maximum Possible Score from ${categoryData.ratingInfo.numEntriesInCategory} Skill(s): ${categoryData.ratingInfo.numEntriesInCategory * MAX_LEVEL}`;
        };

        const hoverEffects = () => {
            if (skillChart.data.datasets[0].borderWidth !== 3 && 
                    skillChart.options.elements.point.radius !== 5) {
                skillChart.data.datasets[0].borderWidth = 3;
                skillChart.options.elements.point.radius = 5;
                
                skillChart.update();
            }
        };

        // Plugins
        const stopHoverEffects = {
            id: 'stopHover',
            beforeEvent(chart, args) {
                const event = args.event;
                
                if (event.type === 'mouseout') {
                    chart.data.datasets[0].borderWidth = 1;
                    chart.options.elements.point.radius = 3;
                    
                    skillChart.update();
                }
            }
        };
        
        // Chart Setup
        const data = {
            labels: this.skills.map(entry => entry.category),
            datasets: [{
                label: `${this.employee.Name}`,
                data: this.skills.map(entry => entry.ratingInfo.ratio),
                borderColor: 'rgba(216, 58, 0, 0.8)',
                borderWidth: 1,
                backgroundColor: 'rgba(88, 103, 232, 0.7)',
            }]
        };

        const options = {
            events: [...Chart.defaults.events, 'mouseleave'],
            onHover: hoverEffects,
            elements: {
                point: {
                    pointStyle: 'rectRot',
                    hoverRadius: 5
                },
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(254, 147, 57, 0.75)'
                    },
                    grid: {
                        circular: true,
                        color: 'rgba(116, 116, 116, 0.25)'
                    },
                    pointLabels: {
                        font: {
                            family: 'sans-serif',
                            color: '#444444',
                            weight: '600'
                        }
                    },
                    ticks: {
                        color: 'rgb(116, 116, 116)',
                        callback: getEveryEvenTick
                    },
                    min: 0,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Sum of Rating / Maximum Rating by Skill Category',
                    font: {
                        family: 'sans-serif',
                        color: '#444444',
                        weight: '900'
                    }
                },
                legend: {
                    title: {
                        display: true,
                        text: 'Employee:',
                        font: {
                            family: 'sans-serif',
                            color: '#444444',
                            weight: 'bold'
                        }
                        
                    },
                    labels: {
                        font: {
                            family: 'sans-serif',
                            color: '#444444'
                        }
                    }
                },
                tooltip: {
                    events: ['click'],
                    callbacks: {
                        footer: tooltipDescription
                    }
                }
            }
        };
        
        // Chart Init
        const ctx = this.template.querySelector('canvas');
        const config = {
            type: 'radar',
            data: data,
            options: options,
            plugins: [stopHoverEffects]
        };

        const skillChart = new Chart(ctx, config);
    }

    // consistent categories across all graphs
    // Assume we can boil skills to 6 or so --> Bucket categories into Technical, Strategy, Design, Product
    // Ratio correct, need different formatting to get there
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

        return { 
            numEntriesInCategory: numEntries,
            sumRatingsInCategory: sumRatings,
            ratio: (sumRatings / (MAX_LEVEL * numEntries)) * 100
        };
    }
}