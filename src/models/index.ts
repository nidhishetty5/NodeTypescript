import { Sequelize } from 'sequelize-typescript';
//import { Sequelize } from 'sequelize';
import { User } from './user';
import { UserContact } from './userContact';
//import { UserContact } from './userContact';
import { UserAddress } from './userAddress';

const sequelize = new Sequelize({
  dialect: 'mssql',
  host: '10.121.40.57',
  username: 'yogi',
  password: 'yogi',
  database: 'DevTwo',
  models: [User, UserContact, UserAddress],
  dialectOptions: {
    options: {
      encrypt: true, // Use this if you're on Windows Azure
      trustServerCertificate: true, // Change to true for local dev / self-signed certs
    },
  },
});

export default sequelize;
