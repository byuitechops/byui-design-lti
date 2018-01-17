/* eslint-env node */
var token
if (process.env.IsHeroku) {
  token = "placeholder"
} else {
  //token = require('../canvasAuth').token
}
var request = require('request')
var domain = 'https://byui.instructure.com';
var auth = {
  json: true,
  headers: {
    Authorization: 'Bearer ' + token
  }
}

/* build the url to look for course level templates */
function getTemplateFolderId(courseNumber) {
  return new Promise(function (resolve, reject) {
    request(domain + '/api/v1/courses/' + courseNumber + '/folders', auth, function (err, data, body) {
      var templateId
      body.forEach(function (each) {
        if (each.full_name == 'course files/Web Files/templates') {
          templateId = each.id
        }
      })
      resolve(templateId)
    }).on('error', function (err) {
      reject(err)
    })
  })
}

/* return all of the files in a given directory */
function getFilesByFolder(folderId) {
  return new Promise(function (resolve, reject) {
    request(domain + '/api/v1/folders/' + folderId + '/files', auth, function (err, data, body) {
      resolve(body)
    }).on('error', function (err) {
      reject(err)
    })
  })
}

/* return the file at a certain url in Canvas */
function getFile(url) {
  return new Promise(function (resolve, reject) {
    request(url, auth, function (err, data, body) {
      resolve(body)
    }).on('error', function (err) {
      reject(err)
    })
  })
}

/* return all of the modules in a course */
function getModules(courseNumber){
  return new Promise(function(resolve, reject){
    request(domain + '/api/v1/courses/' + courseNumber + '/modules', auth, function(err, data, body){
      resolve(body)
    }).on('error', function(err){
      reject(err)
    })
  })
}

module.exports = {
  getTemplateFolderId: getTemplateFolderId,
  getFilesByFolder: getFilesByFolder,
  getFile: getFile,
  getModules: getModules
}
