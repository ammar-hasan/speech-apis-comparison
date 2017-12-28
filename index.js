const express = require("express")
const bodyParser = require("body-parser")
const watson = require('watson-developer-cloud')
var https = require('https')

const app = express()

app.use(express.static('./public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api/watson/token', function(req, res) {
  const hasCreds = !!req.body.username
  const username = hasCreds ? req.body.username : process.env.WATSON_API_USERNAME
  const password = hasCreds ? req.body.password : process.env.WATSON_API_PASSWORD
  
  const sttAuthService = new watson.AuthorizationV1({
    username: username,
    password: password
  })

  sttAuthService.getToken(
    {
      url: watson.SpeechToTextV1.URL
    },
    function(err, token) {
      if (err) {
        console.log('Error retrieving token: ', err)
        res.status(500).send('Error retrieving token')
        return
      }
      res.send(token)
    }
  )
})

app.post('/api/azure/token', function(req, res) {
  var options = {
    host: 'api.cognitive.microsoft.com',
    path: '/sts/v1.0/issueToken',
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Content-Length': '0',
      'Ocp-Apim-Subscription-Key': req.body.apiKey || process.env.AZURE_API_KEY
    }
  }

  const issueTokenRequest = https.request(options, function(response) {
    let token = ''

    response.on('data', function (chunk) {
      token += chunk
    })

    response.on('end', function () {
      res.send(token)
    })
  })

  issueTokenRequest.end()
})

app.listen(3000, () => console.log('Speech apis comparison server listening on port 3000!'))
