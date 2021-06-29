const puppy = require('puppeteer');

const { jsPDF } = require("jspdf"); // will automatically load the node version
const nodemailer = require("nodemailer");
const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
const ps = require('prompt-sync');
const chalk = require('chalk');
const prompt = ps();
let guide = [], from = "", gotop = "", day = "", date = "", year = "", mon = "", day1 = "", date1 = "";
let year1 = "", mon1 = "", child = "", adult = "", tclass = "", place = "", rooms = 0;
let departure = [];
let busesobject = [];
let trainobj = [];
let hotelobj = [];
let wheather = [];
let emailarray = [];
async function main() {
    from = prompt(chalk.red.bold.italic("HELLO WELCOME TO TRIP PLANNER PROJECT --  ENTER YOUR CURRENT DESTINATION "));
    gotop = prompt(chalk.green.bold.italic("ENTER WHERE YOU WANT TO GO "));
    place = gotop.toLocaleLowerCase();
    let d = prompt(chalk.yellow.bgBlack.bold.italic("Enter date when you want to go Pattern ::  28/Jun/2021/Mon "));
    day = d.split("/")[3];
    date = d.split("/")[0];
    year = d.split("/")[2];
    mon = d.split("/")[1];

    d = prompt(chalk.cyan.bold.italic("Enter date when you want to return Pattern ::  28/Jun/2021/Mon "));
    day1 = d.split("/")[3];
    date1 = d.split("/")[0];
    year1 = d.split("/")[2];
    mon1 = d.split("/")[1];

    child = prompt(chalk.magenta.bold.italic("Enter how many childs "))
    adult = prompt(chalk.whiteBright.bold.italic("Enter how many adults "));
    prompt(chalk.greenBright.bold.italic("Enter the travel class in which you want to travel 1. Economy 2. Premium Economy 3. Buisness  "));
    tclass = prompt(chalk.greenBright.bold.italic("Enter here :: "))
    rooms = prompt(chalk.redBright.bold.italic("Enter how many rooms you need in hotel "));
    email = prompt(chalk.bgWhite.black.bold.italic("Enter email "));
    emailarray = email.split(" ");
    console.log(emailarray);
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false,
        slowMo: 300

    });
    let tabs = await browser.pages();
    let tab = tabs[0];



    /// ✈️✈️✈️✈️✈️   FLIGHT DATA     ✈️✈️✈️✈️✈️//////



    await tab.goto('https://www.makemytrip.com/flights/');
    await tab.waitForTimeout(3000)
    await tab.waitForSelector('.menu_Flights');
    await tab.click('.menu_Flights');
    await tab.click('#fromCity');
    await tab.type('[placeholder="From"]', from);
    await tab.click('.react-autosuggest__section-container.react-autosuggest__section-container--first .calc60');
    await tab.click('#toCity');
    await tab.type('[placeholder="To"]', gotop)
    await tab.click('.react-autosuggest__section-container.react-autosuggest__section-container--first .calc60');
    await tab.click(`[aria-label="${day} ${mon} ${date} ${year}"]`);
    await tab.click('[data-cy="returnArea"]');
    await tab.click(`[aria-label="${day1} ${mon1} ${date1} ${year1}"]`);
    await tab.click('[for="travellers"]')
    await tab.click(`[data-cy="adults-${adult}"]`);
    await tab.click(`[data-cy="children-${child}"]`);
    if (tclass == "Buisness") {
        await tab.click(`[data-cy="travelClass-2"]`)
    }
    else if (tclass == "Economy") {
        await tab.click(`[data-cy="travelClass-0"]`)
    }
    else if (tclass == "Premium Economy") {
        await tab.click(`[data-cy="travelClass-1"]`)
    }
    await tab.click('[data-cy="travellerApplyBtn"]')
    await tab.click('[data-cy="submit"]')
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('.paneView:first-child .listingCard').then(async function () {
        let x = await tab.$$('.paneView:first-child .boldFont.blackText');


        //// ✍🏼✍🏼   FLIGHTS NAME FETCH   ✍🏼✍🏼///////


        let fname = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            fname.push(z);
        }


        ///  ✍🏼✍🏼 FLIGHT  TIME  ✍🏼✍🏼 /////


        x = await tab.$$('.paneView:first-child .flightTimeSection:first-child span');
        let dtime = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            dtime.push(z);
        }


        ///  ✍🏼✍🏼 FLIGHT REACH  TIME  ✍🏼✍🏼 /////


        x = await tab.$$('.paneView:first-child .flightTimeSection:nth-child(3) p:first-child');
        let reachtime = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            reachtime.push(z);
        }


        ///   ✍🏼✍🏼  PRICE   ✍🏼✍🏼 ///////


        x = await tab.$$('.paneView:first-child .makeFlex.priceInfo p');
        let price = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            let d = z.split(" ")[1];
            price.push(d);
        }
        for (let i = 0; i < fname.length; i++) {
            let er = {

                "FlightName": fname[i],
                "DepartureTime": dtime[i],
                "ReachTime": reachtime[i],
                "Price": price[i],
                "Travel": `${from} to ${gotop}`
            }
            departure.push(er);
        }

        ///////////////////   😉    next   part return flights               /////////////////////////
        x = await tab.$$('.paneView:nth-child(2) .boldFont.blackText');
        fname = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            fname.push(z);
        }

        x = await tab.$$('.paneView:nth-child(2) .flightTimeSection:first-child span');
        dtime = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            dtime.push(z);
        }

        x = await tab.$$('.paneView:nth-child(2) .flightTimeSection:nth-child(3) p:first-child');
        reachtime = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            reachtime.push(z);
        }

        x = await tab.$$('.paneView:nth-child(2) .makeFlex.priceInfo p');
        price = [];
        for (let i = 0; i < x.length; i++) {
            let z = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            d = z.split(" ")[1];
            price.push(d);
        }

        for (let i = 0; i < fname.length; i++) {
            temp = {

                "FlightName": fname[i],
                "DepartureTime": dtime[i],
                "ReachTime": reachtime[i],
                "Price": price[i],
                "Travel": `${gotop} to ${from}`

            }
            departure.push(temp);
        }


        console.log(departure);


        ///     SAVING  THE DATA IN PDF  /////////



        function createHeaders(keys) {
            var result = [];
            for (var i = 0; i < keys.length; i += 1) {
                result.push({
                    id: keys[i],
                    name: keys[i],
                    prompt: keys[i],
                    width: 100,
                    align: "center",
                    padding: 0
                });
            }
            return result;
        }

        var headers = createHeaders([
            "FlightName",
            "DepartureTime",
            "ReachTime",
            "Price",
            "Travel"
        ]);

        doc.text("FLIGHT DETAILS ", 35, 25)
        doc.table(1, 30, departure, headers, { autoSize: true });


        doc.addPage();

    }).catch(async function () {
        await tab.waitForSelector('.error-title').then(function () {
            doc.text("No Flights Available ", 35, 25);
        }).catch(function () {
            console.log(chalk.bgGreenBright.red.bold("Either their is no flights or your internet connection is slow "));
        })
    })



    // //////// 🚌🚌     bus part    🚌🚌🚌 ///////////////




    await tab.goto('https://www.makemytrip.com/bus-tickets/')

    await tab.waitForSelector('[data-cy="menu_Buses"]')
    await tab.click('[data-cy="menu_Buses"]');
    await tab.click("#fromCity");
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('[placeholder="From"]');
    await tab.type('[placeholder="From"]', from);
    await tab.click('.react-autosuggest__suggestions-list p:first-child');
    await tab.click('#toCity');
    await tab.waitForSelector('[placeholder="To"]');
    await tab.type('[placeholder="To"]', gotop);
    await tab.click('.react-autosuggest__suggestions-list p:first-child');
    await tab.click(`[aria-label="${day} ${mon} ${date} ${year}"]`);
    await tab.click('[data-cy="submit"]');
    let busname = [];
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('.latoBlack.font22.blackText.appendRight15').then(async function () {
        x = await tab.$$('.latoBlack.font22.blackText.appendRight15');
        ///////// collect all buses name in array /////////
        for (let i = 0; i < x.length; i++) {
            let t = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])

            busname.push(t);
        }


        ///////// collect all buses start time //////////////////

        let stime = [];
        x = await tab.$$('.makeFlex.row.hrtlCenter.appendBottom20 div:nth-child(1)');
        console.log(x.length);
        for (let i = 0; i < x.length; i++) {
            let t = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            t = t.split(',')[0];
            stime.push(t);
        }


        ////////// collect all buses time taken  ////////////////////////////


        let timeneed = [];
        x = await tab.$$('.makeFlex.row.hrtlCenter.appendBottom20 div:nth-child(3)');

        for (let i = 0; i < x.length; i++) {
            let t = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])

            timeneed.push(t);
        }


        //////////// collect all buses time to reahc //////////////////////

        let rtime = [];
        x = await tab.$$('.makeFlex.row.hrtlCenter.appendBottom20 div:nth-child(5)');

        for (let i = 0; i < x.length; i++) {
            let t = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            t = t.split(',')[0];
            rtime.push(t);
        }


        /////////// collect price of buses  ///////////////////////////////

        price = [];
        x = await tab.$$('.sc-ckVGcZ.dYlDBG');

        for (let i = 0; i < x.length; i++) {
            let t = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])

            price.push(t);
        }
        ////////// data is stroed in theri respective array now make object of all buses ///////  


        for (let i = 0; i < price.length; i++) {
            let temp = {
                "BusName": busname[i],
                "ArrivalTime": stime[i],
                "ReachTime": rtime[i],
                "TimeNeed": timeneed[i],
                "Price": price[i]
            }
            busesobject.push(temp);
        }
        console.log(busesobject);

        /////////  PDF CREATION   ////////////////
        function createHeaders(keys) {
            var result = [];
            for (var i = 0; i < keys.length; i += 1) {
                result.push({
                    id: keys[i],
                    name: keys[i],
                    prompt: keys[i],
                    width: 100,
                    align: "center",
                    padding: 0
                });
            }
            return result;
        }

        var headers = createHeaders([
            "BusName",
            "ArrivalTime",
            "ReachTime",
            "TimeNeed",
            "Price"
        ]);

        doc.text(`BUSES LIST FOR ${gotop} `, 35, 25)
        doc.table(1, 30, busesobject, headers, { autoSize: true });

        doc.addPage();
    }).catch(async function () {

        console.log(chalk.bgMagentaBright.white.bold("Either There is no buses availabe or your internet connection is slow "));

    })


    // ///////////  🚉  🚉   ---------  train part ------------- 🚉  🚉 - //////////////////////

    await tab.goto('https://www.makemytrip.com/railways/');
    await tab.waitForSelector('[data-cy="menu_Trains"]')
    await tab.click('[data-cy="menu_Trains"]');
    await tab.click("#fromCity");
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('[placeholder="From"]');
    await tab.type('[placeholder="From"]', from);
    await tab.click('.react-autosuggest__suggestions-list p:first-child');
    await tab.click('#toCity');
    await tab.waitForSelector('[placeholder="To"]');
    await tab.type('[placeholder="To"]', gotop);
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('.react-autosuggest__suggestions-list p:first-child')
    await tab.click('.react-autosuggest__suggestions-list p:first-child');
    await tab.click(`[aria-label="${day} ${mon} ${date} ${year}"]`);

    await tab.click('[data-cy="submit"]');
    await tab.click('[data-cy="submit"]');
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('.train-name').then(async function () {
        let trainnames = [];
        x = await tab.$$('.train-name');
        for (let i = 0; i < x.length; i++) {
            let y = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            let y1 = y.split(0, 8)
            trainnames.push(y1);
        }
        stime = [];
        x = await tab.$$('.depart-time');
        for (let i = 0; i < x.length; i++) {
            let y = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            stime.push(y);
        }

        let sname = [];
        x = await tab.$$('.flex.flex-column:first-child .station-name');
        for (let i = 0; i < x.length; i++) {
            let y = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            sname.push(y);
        }

        let duration = [];
        x = await tab.$$('.duration');
        for (let i = 0; i < x.length; i++) {
            let y = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            duration.push(y);
        }

        rtime = [];
        x = await tab.$$('.arrival-time');
        for (let i = 0; i < x.length; i++) {
            let y = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            rtime.push(y);
        }

        let rsname = [];
        x = await tab.$$('.flex.flex-column:nth-child(3) .station-name');
        for (let i = 0; i < x.length; i++) {
            let y = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, x[i])
            rsname.push(y);
        }

        for (let i = 0; i < rsname.length; i++) {
            let obj = {
                "TrainN": trainnames[i],
                "ArrivalT": stime[i],
                "ArrivalSt": sname[i],
                "ReachT": rtime[i],
                "EndSta": rsname[i],
                "Time": duration[i]
            }
            trainobj.push(obj);
        }

        /////////// pdf  / ////////////////

        function createHeaders1(keys) {
            var result = [];
            for (var i = 0; i < keys.length; i += 1) {
                result.push({
                    id: keys[i],
                    name: keys[i],
                    prompt: keys[i],
                    width: 100,
                    align: "center",
                    padding: 0
                });
            }
            return result;
        }

        var headers = createHeaders1([
            "TrainN",
            "ArrivalT",
            "ArrivalSt",
            "ReachT",
            "EndSta",
            "Time"
        ]);

        doc.text(`TRAINS LIST FOR  ${gotop} `, 35, 25)
        doc.table(1, 30, trainobj, headers, { autoSize: true });

        doc.addPage();
    }).catch(function () {

        console.log(chalk.bgWhite.black.bold("Either no train is available or internet is slow "));
    })



    //////////🏨 🏨  ---  HOTELS BOOKING PART  --- 🏨 🏨  ///////////////


    await tab.goto('https://www.makemytrip.com/hotels/');
    await tab.waitForSelector('.menu_Hotels');
    await tab.click('.menu_Hotels');
    await tab.click('[data-cy="city"]');
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('[placeholder="Enter city/ Hotel/ Area/ Building"]')
    await tab.type('[placeholder="Enter city/ Hotel/ Area/ Building"]', gotop);
    await tab.click('[role="option"]:first-child .locusLabel.appendBottom5');
    await tab.click(`[aria-label="${day} ${mon} ${date} ${year}"]`);
    await tab.click(`[aria-label="${day1} ${mon1} ${date1} ${year1}"]`);

    await tab.click('[data-cy="guest"]');
    for (let i = 0; i < rooms - 1; i++) {
        await tab.waitForTimeout(3000);
        await tab.waitForSelector('[data-cy="addAnotherRoom"]')
        await tab.click('[data-cy="addAnotherRoom"]');
    }
    await tab.click('[data-cy="submitGuest"]')
    await tab.click('[data-cy="submit"]');


    //Extracting "Hotel Name" Information


    await tab.waitForTimeout(10000)
    await tab.waitForSelector('.latoBlack.font22.blackText.appendBottom12').then(async function () {

        await autoScroll(tab)
        await tab.waitForTimeout(3000);

        let HotelNameTag = await tab.$$(".latoBlack.font22.blackText.appendBottom12");



        let HotelName = [];
        for (let i = 0; i < HotelNameTag.length; i++) {
            let text1 = await tab.evaluate(function (ele) {
                return ele.textContent;
            }, HotelNameTag[i]);
            HotelName.push(text1);
        }
        console.log(HotelName);


        //Extracting "Hotel Address" Information



        let HotelAddressTag = await tab.$$(".tile__placeHolder.font12.font12.latoBold.appendBottom5.grayText.pc__middle");
        let HotelAddress = [];
        for (let i = 0; i < HotelAddressTag.length; i++) {
            let text2 = await tab.evaluate(function (ele) {
                return ele.textContent;
            }, HotelAddressTag[i]);
            HotelAddress.push(text2);
        }
        console.log(HotelAddress);

        //Extracting "Hotel Price" Information////



        let HotelPriceTag = await tab.$$(".latoBlack.font26.blackText.appendBottom5");
        let HotelPrice = [];
        for (let i = 0; i < HotelPriceTag.length; i++) {
            let text5 = await tab.evaluate(function (ele) {
                return ele.textContent;
            }, HotelPriceTag[i]);
            let v = text5.split(" ")[1];
            HotelPrice.push(v);
        }
        console.log(HotelPrice);
        for (let i = 0; i < HotelAddressTag.length; i++) {
            let x = {
                "Name": HotelName[i],
                "Address": HotelAddress[i],
                "Price": HotelPrice[i]

            }
            hotelobj.push(x);
        }

        function createHeaders1(keys) {
            var result = [];
            for (var i = 0; i < keys.length; i += 1) {
                result.push({
                    id: keys[i],
                    name: keys[i],
                    prompt: keys[i],
                    width: 100,
                    align: "center",
                    padding: 0
                });
            }
            return result;
        }

        var headers = createHeaders1([
            "Name",
            "Address",
            "Price"
        ]);


        doc.text(`HOTEL  LIST IN ${gotop} `, 35, 25)
        doc.table(1, 30, hotelobj, headers, { autoSize: true });

        doc.addPage();

    }).catch(function () {
        console.log(chalk.bgYellowBright.black.bold("Either no hotels are available or your internet is slow  "));
    })


    //////////// ⛱ ⛱   whether  ⛱ ⛱ ⛱  ////////////////////




    await tab.goto('https://weather.com/en-IN/?Goto=Redirected');
    await tab.waitForSelector('#LocationSearch_input');
    await tab.waitForTimeout(10000);

    await tab.click('#LocationSearch_input');
    await tab.type('[role="textbox"]', gotop);

    await tab.waitForTimeout(3000);
    await tab.waitForSelector('[aria-label="Search Result List"] [data-testid="ctaButton"]:first-child');
    await tab.click('[aria-label="Search Result List"] [data-testid="ctaButton"]:first-child')
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('[data-from-string="localsuiteNav_3_10 Day"]');
    await tab.click('[data-from-string="localsuiteNav_3_10 Day"]');
    await tab.waitForTimeout(3000)
    await tab.waitForSelector('[data-testid="DetailsSummary"] .DetailsSummary--daypartName--1Mebr')
    x = await tab.$$('[data-testid="DetailsSummary"] .DetailsSummary--daypartName--1Mebr');
    let daysname = [];
    console.log(x.length);
    for (let i = 0; i < 6; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, x[i])
        daysname.push(y);
    }
    console.log(daysname);

    let maxtemp = [];
    await tab.waitForSelector('[data-testid="detailsTemperature"] .DetailsSummary--highTempValue--3x6cL')
    x = await tab.$$('[data-testid="detailsTemperature"] .DetailsSummary--highTempValue--3x6cL');
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, x[i])
        maxtemp.push(y);
    }
    console.log(maxtemp);
    let mintemp = [];
    x = await tab.$$('[data-testid="detailsTemperature"] .DetailsSummary--lowTempValue--1DlJK');
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, x[i])
        mintemp.push(y);
    }
    console.log(mintemp);
    let detail = [];
    x = await tab.$$('[data-testid="wxIcon"] .DetailsSummary--extendedData--aaFeV');
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, x[i])
        detail.push(y);
    }
    console.log(detail);

    for (let i = 0; i < 6; i++) {
        let t = {
            "Day": daysname[i],
            "MaxTemp": maxtemp[i],
            "MinTemp": mintemp[i],
            "Detail": detail[i]
        }
        wheather.push(t);
    }

    console.log(wheather);
    /////////// pdf  / ////////////////
    function createHeaders(keys) {
        var result = [];
        for (var i = 0; i < keys.length; i += 1) {
            result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 100,
                align: "center",
                padding: 0
            });
        }
        return result;
    }

    var headers = createHeaders([
        "Day",
        "MaxTemp",
        "MinTemp",
        "Detail"
    ]);


    doc.text(`TEMPERATURE IN  ${gotop} `, 35, 25)
    doc.table(50, 30, wheather, headers, { autoSize: true });
    doc.addPage();




    /////////  🏞 🏞  tour guides    ///////////////////



    await tab.goto('https://www.showaround.com/');
    await tab.waitForSelector('[type="text"]:nth-child(3)');
    await tab.click('[type="text"]:nth-child(3)');
    await tab.type('[type="text"]:nth-child(3)', gotop);
    await tab.keyboard.press('Enter');

    let glinks = [];
    await tab.waitForSelector('.Guides-column .Guide');
    x = await tab.$$('.Guides-column .Guide');
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.getAttribute("href");
        }, x[i])
        glinks.push("https://www.showaround.com" + y);
    }
    console.log(glinks);

    let gname = [];
    await tab.waitForSelector('.Guide-name.ng-binding')
    x = await tab.$$('.Guide-name.ng-binding');
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, x[i])
        gname.push(y);
    }
    console.log(gname);
    let gprice = [];
    await tab.waitForSelector('.Guide-price.ng-binding')
    x = await tab.$$('.Guide-price.ng-binding');
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, x[i])
        let t = y.split("/")[0];

        gprice.push(t);
    }
    console.log(gprice);



    for (let i = 0; i < gname.length; i++) {
        let x = {
            "Name": gname[i],
            "Price/Hour": gprice[i],
            "Link": glinks[i]

        }
        guide.push(x);
    }

    function createHeaders1(keys) {
        var result = [];
        for (var i = 0; i < keys.length; i += 1) {
            result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 100,
                align: "center",
                padding: 0
            });
        }
        return result;
    }

    var headers = createHeaders1([
        "Name",
        "Price/Hour",
        "Link"
    ]);


    doc.text(`TOUR GUIDES LIST IN ${gotop} `, 35, 25)
    doc.table(1, 30, guide, headers, { autoSize: true });
    doc.addPage();



    //////////////     places to visit    /////////////

    await tab.goto(`https://www.goibibo.com/destinations/${place}/places-to-visit-in-${place}/`)

    let imglink = [];
    await tab.waitForTimeout(3000);
    await tab.waitForSelector('.caption_media.lazy')
    x = await tab.$$('.caption_media.lazy');
    console.log(x.length);
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.getAttribute("data-original");
        }, x[i])
        imglink.push(y);
    }
    console.log(imglink);

    let title = [];
    await tab.waitForSelector('.caption_overlay_title')
    x = await tab.$$('.caption_overlay_title');
    console.log(x.length);
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText
        }, x[i])
        title.push(y);
    }



    let content = [];
    await tab.waitForSelector('.caption_overlay_content')
    x = await tab.$$('.caption_overlay_content');
    console.log(x.length);
    for (let i = 0; i < x.length; i++) {
        let y = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, x[i])
        content.push(y);
    }

    const imageToBase64 = require('image-to-base64');
    doc.addPage();
    doc.text(`PLACES TO VISIT IN  ${gotop} `, 35, 25)
    let j = 40
    let k = 50;
    let l = 70;

    for (let i = 0; i < imglink.length; i++) {
        let a = "";

        imageToBase64(imglink[i]) // Image URL
            .then(
                function (response) {
                    a = response
                }
            )
            .catch(
                (error) => {
                    console.log(error); // Logs an error if there was one
                }
            )

        setTimeout(function () {

            if (a == "") {
                doc.addImage("https://ctkbiotech.com/wp/wp-content/uploads/2018/03/not-available.jpg", "JPEG", 15, j, 50, 60)
            } else {
                doc.addImage(a, "JPEG", 15, j, 50, 60);
            }
            if (i >= title.length) {
                doc.text(" ", 80, k);
            } else {
                doc.text(title[i], 80, k)
            }
            if (i >= content.length) {
                doc.text(" ", 80, l);
            }
            else {
                doc.text(content[i], 80, l)
            }
            j = j + 80;
            k = k + 80;
            l = l + 80;
            if ((i + 1) % 2 == 0) {
                j = 40;
                k = 50;
                l = 70;
                doc.addPage();
            }

        }, 5000);
    }

    setTimeout(function () {
        doc.save('data.pdf')

        var transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: "nodesdugshackathon@outlook.com",
                pass: "sdugs123",
            },
        });

        // setup e-mail data with unicode symbols

        var mailOptions = {
            from: "nodesdugshackathon@outlook.com", // sender address
            to: emailarray, // list of receivers
            attachments: [
                {
                    filename: "op.pdf",
                    path: "data.pdf",
                }

            ],
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent to : ' + emailarray);
            browser.close();
            console.log(chalk.bgBlueBright.black.bold("HAVE A SAFE JOURNEY AND ENJOY "));
        });


    }, 25000)



}






main();


/////  WINDOW SCROLL FUNCTION  ///////
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                setTimeout(function () {
                    clearInterval(timer)
                }, 20000)
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}