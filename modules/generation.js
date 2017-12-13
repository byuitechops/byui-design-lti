/*eslint-env node*/

var ejs = require('ejs');

/*  */
function renderHomePage(courseName, courseId, courseClass) {
    var homePageTemplate = require('../views/homePage.ejs')
    var homePage = ejs.render(homePageTemplate, {
      courseName: courseName,
      courseId: courseId,
      courseClass: courseClass
    })
    return(homePage)
}

module.exports = {
  renderHomePage: renderHomePage
}