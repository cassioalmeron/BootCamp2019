// import dotenv from 'dotenv';
const dotenv = require('dotenv');
// console.log('X', process.env.NODE_ENV);

process.env.NODE_ENV = process.env.NODE_ENV.trimLeft();
process.env.NODE_ENV = process.env.NODE_ENV.trimRight();

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
