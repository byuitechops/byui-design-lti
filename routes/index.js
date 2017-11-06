/* eslint-env node */
var express = require('express');
var router = express.Router();
var templates = "<p class='error'>There was an error loading the templates<?p>";
var canvas = require('../modules/canvasApi');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

/* Handle LTI launch */
router.post('/', function (req, res, next) {
  var ltiParams = req.session.lti.params
  var courseNumber = (ltiParams.content_item_return_url).split('/')[4];

  var content_items = {
    "@context": "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
    "@graph": [{
      "@type": "ContentItem",
      "text": '',
      "mediaType": "text/html",
      "placementAdvice": {
        "presentationDocumentTarget": "embed"
      }
      }]
  }

  res.render('selectFeature', {
    contentItems: JSON.stringify(content_items),
    returnUrl: req.session.lti.params.content_item_return_url,
    courseNumber: courseNumber
  })
})

router.get('/templates', function (req, res, next) {
  if (!req.session.lti) {
    res.render('error', {
      message: "Not authenticated",
      error: {
        status: "401",
        stack: "Please authenticate and try again"
      }
    })
  } else {
    var ltiParams = req.session.lti.params
    var courseNumber = (ltiParams.content_item_return_url).split('/')[4];

    canvas.getTemplateFolderId(courseNumber).then(canvas.getFilesByFolder).then(function (response) {
      res.json({
        templates: response
      })
    })
  }
})

router.get('/preview', function (req, res, next) {
  var url = req.query.url;
  canvas.getFile(url).then(function (file) {
    res.send(file)
  })
})

module.exports = router;
