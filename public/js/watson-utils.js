window.ns.utils.watson = (function () {
	return {
		createToken: function(username, password) {
			return fetch('/api/watson/token', {
			    method: 'post',
			    headers: {
			        'Accept': 'application/json, text/plain, */*',
			        'Content-Type': 'application/json; charset=utf-8'
			    },
			    body: JSON.stringify({
			    	username: username,
			    	password: password
			    })
			}).then(function (response) {
				if (response.status !== 200) {
					throw new Error("Could not fetch token.");
				}
				return response.text()
			})
		},
		uploadFile: function (file, outputEl) {
			window.ns.utils.watson.createToken().then(function (token) {
				stream = WatsonSpeech.SpeechToText.recognizeFile({
			      token: token,
			      file: file,
			      outputElement: outputEl
			    })
			    stream.on('error', function(err) {
			        console.log(err)
			    })
			}).catch(function (err) {
				console.log(err)
			})
		}
	}
}())