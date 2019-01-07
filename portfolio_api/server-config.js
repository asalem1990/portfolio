var nodemailer = require('nodemailer');
// DATABASE
const DBHOST = "xxxx.xxxx.xxxx.xxxx"; // THE IP ADDRESS OF YOUR DATABSE
const DBUSER = "xxxxxxxx"; // DATABASE USERNAME
const DBPASSWORD = "xxxxxxxx"; // DATABSE PASSWORD
const DBNAME = "xxxxxxxx"; // DATABSE NAME
// DATABASE TABLES
const DBTABLE_PROJECTS = 'xxxxxxxx'; // PROJECTS TABLE NAME
const DBTABLE_SKILLS = 'xxxxxxxx'; // SKILLS TABLE NAME
const DBTABLE_EXPERIENCES = 'xxxxxxxx'; // EXPERIENCES TABLE NAME
const DBTABLE_WEBSITE = 'xxxxxxxx'; // WEBSITE TABLE NAME (THE TABLE WHICH IS USED FOR THE GENERIC INFORMATIONS LIKE THE ABOUT ME)
// DIRECTORIES
const PUBLIC_FRONT_DIRECTORY = "xxxxxxxx"; // THE FULL DIRECTORY PATH OF WHERE THE ASSETS FOLDER IS LOCATED
const PUBLIC_FRONT_ASSETS_DIRECTORY = `${PUBLIC_FRONT_DIRECTORY}xxxxxxxx`; // THE ASSETS DIRECTORY NAME APPENDED TO THE FULL PROJECT DIRECTORY PATH
const PUBLIC_FRONT_ASSETS_COMPANIES_DIRECTORY = `assets/xxxxxxxx/`; // WHERE DO YOU SAVE THE COMPANIES LOGOS
const PUBLIC_FRONT_ASSETS_SKILLS_DIRECTORY = `assets/xxxxxxxx/`; // WHERE DO YOU SAVE THE SKILLS LOGOS
const PUBLIC_FRONT_ASSETS_PROJECTS_DIRECTORY = `assets/xxxxxxxx/`; // WHERE DO YOU SAVE THE PROJECTS SCREENSHOTS
// AUTHENTICATIONS
const ADMIN_USERNAME = "xxxxxxxx"; // DASHBOARD LOGIN USERNAME
const ADMIN_PASSWORD = "xxxxxxxx"; // DASHBOARD LOGIN PASSWORD
// MAIL
const MAIL_TRANSPORTER = nodemailer.createTransport({
  host: 'mail.xxxxxxxx', // MAIL PROVIDOR HOSTNAME
  secure: true, // SECURE (TRUE\FALSE)
  port: 465, // MAIL HOST PORT
  tls: {
      rejectUnauthorized: false
  },
  auth: {
    user: 'xxxxxxxx', // MAIL USERNAME THAT IS USED TO LOGIN TO THE MAIL
    pass: 'xxxxxxxx' // MAIL PASSWORD THAT IS USED TO LOGIN TO THE MAIL
  }
});

module.exports = {
  DBHOST,
  DBUSER,
  DBPASSWORD,
  DBNAME,
  DBTABLE_PROJECTS,
  DBTABLE_SKILLS,
  DBTABLE_EXPERIENCES,
  DBTABLE_WEBSITE,
  PUBLIC_FRONT_DIRECTORY,
  PUBLIC_FRONT_ASSETS_DIRECTORY,
  PUBLIC_FRONT_ASSETS_COMPANIES_DIRECTORY,
  PUBLIC_FRONT_ASSETS_SKILLS_DIRECTORY,
  PUBLIC_FRONT_ASSETS_PROJECTS_DIRECTORY,
  MAIL_TRANSPORTER,
  ADMIN_USERNAME,
  ADMIN_PASSWORD
}