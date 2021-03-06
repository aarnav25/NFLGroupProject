var topMenuBarEnEspanol = require('../testAssets/topMenuBarEnEspanol')
var nfcTeams = require('../testAssets/nfcTeams')
var afcTeams = require('../testAssets/afcTeams')
var nflTeams = require('../testAssets/nflTeams')


var topMenuBarContains = function(browser, topMenuBarEnEspanol) {
    browser
    //clcik on each of the links on the top menu bar and verify has the righ order and contains the righ text
        .useXpath()
        .waitForElementPresent(`(//li[@class="fxdCategoryPrimary ng-scope"])[${topMenuBarEnEspanol.link}]`)
        .pause(500)
        .useXpath()
        .verify.containsText(`(//li[@class="fxdCategoryPrimary ng-scope"])[${topMenuBarEnEspanol.link}]`, `${topMenuBarEnEspanol.Section}`)
        .useCss()
}

var pageObject = {}

module.exports = {
    beforeEach: browser => {
        pageObject = browser.page.nflPageCesar()
        pageObject.resizeWindow(1920, 1080)

        pageObject
            .navigate()

    },
    after: browser => {
        browser.end()

    },
    'Verify the spanish page launch (En Español)': browser => {
        pageObject
            .closePopUpWindow()
            .OpenEnEspanolPage(1)
            .assert.urlContains('foxdeportes.com/nfl/')
            .assert.containsText('@teamsContainer', 'Equipos de la NFL')

    },
    'Verify that the top Bar En Español contains': browser => {
        pageObject
            .OpenEnEspanolPage(2)
            .useXpath()
        topMenuBarEnEspanol.forEach(test => {
            topMenuBarContains(pageObject, test)
            console.log(test.link)
            console.log(test.Section)
        })
    },
    'Verify Teams page launch': browser => {
        pageObject
            .OpenTeamsPage()
            .assert.urlContains('nfl.com/teams/')

    },
    'Verify teams page is divided into two groups': browser => {
        pageObject
            .closePopUpWindow()
            .OpenTeamsPage()
            .assert.containsText('@headrersTeamsDivisionNFC', 'NFC Teams')
            .assert.containsText('@headrersTeamsDivisionAFC', 'AFC Teams')

    },
    'Verify each group on teams page contains 16 teams ': browser => {
        pageObject
            .OpenTeamsPage()
        console.log(nfcTeams.length)
        console.log(afcTeams.length)
        for (let n = 1, f = 17, i = 0, j = 0; n < 16, f < 32, i < nfcTeams.length, j < nfcTeams.length; n++, f++, i++, j++) {
            pageObject
                .useXpath()
                .waitForElementPresent(`(//h4[@class="d3-o-media-object__roofline nfl-c-custom-promo__headline"])[${n}]`)
                .waitForElementPresent(`(//h4[@class="d3-o-media-object__roofline nfl-c-custom-promo__headline"])[${f}]`)
                .assert.containsText(`(//h4[@class="d3-o-media-object__roofline nfl-c-custom-promo__headline"])[${n}]`, nfcTeams[i])
                .assert.containsText(`(//h4[@class="d3-o-media-object__roofline nfl-c-custom-promo__headline"])[${f}]`, afcTeams[j])
        }
    },
    'Verify user can open the 32 profile for each team, and Verify user is redirect to the rigth page': browser => {
        pageObject
            .OpenTeamsPage()
        console.log(nflTeams.length)
        for (let j = 0, i = 1; j < nflTeams.length, i < 33; j++, i++) {
            pageObject
                .useXpath()
                .waitForElementPresent(`(//a[@target="_self"])[${i}]`)
                .click(`(//a[@target="_self"])[${i}]`)
                .waitForElementPresent('@teamNameHeader')
                .verify.containsText('@teamNameHeader', nflTeams[j])
                .api.back()


        }
    },
    'Verify standings page launch': browser => {
        pageObject
            .closePopUpWindow()
            .OpenStandingsPage()
            .assert.urlContains('nfl.com/standings/')
    },
    'Verify they are 3 buttons and each button should contain: Divison - Conference - League': browser => {
        pageObject
            .closePopUpWindow()
            .OpenStandingsPage()
            .pause(500)
            .verify.containsText('@division', "DIVISION")
            .verify.containsText('@conference', "CONFERENCE")
            .verify.containsText('@league', "LEAGUE")
    },
    'Verify the continer background change when user select them': browser => {
        pageObject
            .closePopUpWindow()
            .OpenStandingsPage()
            .pause(500)
            //Division Button Selected (color blue)
            .assert.cssProperty('li[class="active"]', 'background-color', 'rgba(27, 72, 224, 1)')
            //division Button Unselected (no color in the background)
            .click('@conference')
            .pause(500)
            .assert.cssProperty('a[href="/standings/division/2020/REG"]', 'background-color', 'rgba(0, 0, 0, 0)')
            //Conference Button Selected (color blue)
            .assert.cssProperty('li[class="active"]', 'background-color', 'rgba(27, 72, 224, 1)')
            //Conference Button Unselected (no color in the background)
            .click('@league')
            .pause(500)
            .assert.cssProperty('a[href="/standings/conference/2020/REG"]', 'background-color', 'rgba(0, 0, 0, 0)')
            //League Button Selected (color blue)
            .assert.cssProperty('li[class="active"]', 'background-color', 'rgba(27, 72, 224, 1)')
            //league Button Unselected (no color in the background)
            .click('@division')
            .pause(500)
            .assert.cssProperty('a[href="/standings/league/2020/REG"]', 'background-color', 'rgba(0, 0, 0, 0)')



    },
    'Verify W : Wins L: Losses T: Ties  PCT: Winning Percentage  shows the highes value on the  respective column': browser => {
        pageObject
            .OpenStandingsPage()
        for (let i = 2; i <= 7; i++) {
            //Select a column
            pageObject
                .useXpath()
                //Sort the list from highest to lowes
                .click('(//th)[5]')
                .click(`(//th)[${i}]`)
            for (let count = 0; count <= 1; count++) {
                pageObject
                //get highest value in the column
                    .getText('(//td[@class="selected"])[1]',
                    function name(result) {
                        console.log(result.value + ' Result Value')
                        var a = parseFloat(result.value)
                        pageObject
                        //get second highest value in the column
                            .getText('(//td[@class="selected"])[2]',
                            function name(result2) {
                                console.log(result2.value + ' Result2')
                                var b = parseFloat(result2.value)
                                console.log(a + ' a')
                                console.log(b + ' b')
                                if (count === 0) {
                                    pageObject
                                        .verify.ok(a >= b, 'a >= b')
                                        .click(`(//th)[${i}]`)
                                }
                                pageObject
                                    .pause(100)

                            })
                    })
            }
        }
    }
}