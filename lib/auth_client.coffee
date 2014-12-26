serviceaccountEmail = '626356564626-c0jcp54am7g6fngi56injcd10j4s0eqo@developer.gserviceaccount.com'
pemFilename = __dirname + '/../data/SFBA-b8abd06e1121.pem'
scope = 'https://www.googleapis.com/auth/drive'

google = require 'googleapis'

jwtClient = new google.auth.JWT serviceaccountEmail, pemFilename, null, scope

module.exports = jwtClient