//Unix epoc Jan 1st 1970 00:00:00
const moment = require('moment');


const date = moment();
// date.add(100, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY')); 


//10:35 am 
//6:01 am
const someTimestamp = moment().valueOf();
console.log(someTimestamp);

const createAt = 1234;
const date2 = moment(createAt);

console.log(date.format('h:mm a'))
