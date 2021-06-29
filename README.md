# TripPlannerProject
A automation script build using Puppeteer and Nodejs which fetches all the details for a trip.

I have made Trip Planner automation script using Puppeteer and Nodejs. 

This script fethes all the details that required for  a trip like ::

Flights , Buses , Trains details from makemytrip.com website. 🚆🚌✈️

Hotels details where user want to go from makemytrip.com website 🏨

Next 7 days wheather in that place wheather.com 🏖️

Tour Guides list in that are  showaround.com 🏕️

Top places to visit in that place including images from  goibibo.com 🌄



After fetching all the details I have store all the data in PDF file . For creating PDF  i have used jsPDF librrary of Javascript. 

Using nodemailer library of Javscript the PDF file which contains all the data is sent to emails which was provided by the user. 


Details like when user want to go , when he want to return , where they want to go , how many rooms they need . all the information is given by user. 

To run this project intall given JS libraries :

👉 Install Puppeteer for Automation :
command : npm i puppeteer

👉 Install jsPDF  for creating pdf files :
command : npm i jsPDF

👉 Install nodemailer for sending mails :
command : npm i nodemailer

👉 Install chalk for creating gui :
command : npm i chalk

👉 Install prompt-sync for taking input
command : npm i prompt-sync

After installing all the libraries : run file using command : node test.js 

