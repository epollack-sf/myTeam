import { LightningElement } from 'lwc';

export default class MyTeamTestContainer extends LightningElement {
    skills = [
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Bowling',
            Rating__c: 4
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Archery',
            Rating__c: 1
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Skiing',
            Rating__c: 5
        },
        {
            id: '1',
            Type__c: 'Type',
            Category__c: 'Skiing',
            Rating__c: 2
        },
    ];
}