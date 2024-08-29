"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
//import { Sequelize } from 'sequelize';
const user_1 = require("./user");
const userContact_1 = require("./userContact");
//import { UserContact } from './userContact';
const userAddress_1 = require("./userAddress");
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'mssql',
    host: '10.121.40.57',
    username: 'yogi',
    password: 'yogi',
    database: 'DevTwo',
    models: [user_1.User, userContact_1.UserContact, userAddress_1.UserAddress],
    dialectOptions: {
        options: {
            encrypt: true, // Use this if you're on Windows Azure
            trustServerCertificate: true, // Change to true for local dev / self-signed certs
        },
    },
});
exports.default = sequelize;
