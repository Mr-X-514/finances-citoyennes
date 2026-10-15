import assert from 'node:assert/strict';
import {records,revenueItems,expenseItems} from '../lib/financial-data.ts';
for(const record of records){
 assert.equal(record.revenue-record.expense,record.balance,`Solde ${record.year}`);
 assert.equal(record.liabilities-record.assets,record.debt,`Dette nette ${record.year}`);
}
assert.equal(revenueItems.reduce((sum,row)=>sum+row[1],0),156088);
assert.equal(expenseItems.reduce((sum,row)=>sum+row[1],0),161263);
console.log('Totaux financiers vérifiés pour les trois exercices et les ventilations 2024–2025.');
