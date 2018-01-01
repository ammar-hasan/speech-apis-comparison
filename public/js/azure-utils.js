window.ns.utils.azure = (function () {
	return {
		createToken: function(apiKey) {
			return fetch('/api/azure/token', {
			    method: 'post',
			    headers: {
			        'Accept': 'application/json, text/plain, */*',
			        'Content-Type': 'application/json; charset=utf-8'
			    },
			    body: JSON.stringify({
			    	apiKey: apiKey 
			    })
			}).then(function (response) {
				if (response.status !== 200) {
					throw new Error("Could not fetch token.");
				}
				return response.text()
			})
		},
		uploadFile: function (file, outputEl) {
			var recognitionMode = SDK.RecognitionMode.Dictation,
				language = "en-US",
				format = SDK.SpeechResultFormat["Detailed"],
				recognizerConfig = new SDK.RecognizerConfig(
	                new SDK.SpeechConfig(
	                    new SDK.Context(
	                        new SDK.OS(navigator.userAgent, "Browser", null),
	                        new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000")
                        )
                    ),
	                recognitionMode,
	                language,
	                format
	            ),
	            authMaker = function () {
	            	var cb = function () {
	            		var tokenDeferral = new SDK.Deferred()
	            		window.ns.utils.azure.createToken().then(function(token) {
	            			tokenDeferral.Resolve(token)
	            		}).catch(function () {
	            			tokenDeferral.Reject('Issue token request failed.')
	            		})
	            		return tokenDeferral.Promise()
	            	}
	            	return new SDK.CognitiveTokenAuthentication(cb, cb)
	            },
	            auth = authMaker(),
	            transcript = []

	        SDK.CreateRecognizerWithFileAudioSource(recognizerConfig, auth, file).Recognize((event) => {
               	if (event.Name === "SpeechHypothesisEvent") {
               		$(outputEl).html(event.Result.Text)
               	} else if (event.Name === "SpeechFragmentEvent") {
               		var val = $(outputEl).html();
               		$(outputEl).html(val + " " + event.Result.Text)
               	} else if (event.Name === "SpeechDetailedPhraseEvent" && event.Result.NBest.length > 0) {
               		transcript.push(event.Result.NBest[0].Display)
               	} else if (event.Name === "RecognitionEndedEvent") {
               		$(outputEl).html(transcript.join(' '))
               	}
            })
            .On(
            	function () {},
	            function (error) {
	                console.error(error);
	            }
	        )
		}
	}
}())