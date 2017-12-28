window.ns.modules.watson = (function(el) {
	"use strict"

	var watson = new Vue({
		el: el,
		data: {
			title: "Watson API",
			fileLabel: "Select audio file",
			file: null
		},
		methods: {
			onFileChange: function (e) {
				var files = e.target.files || e.dataTransfer.files
		      	if (!files.length) {
		      		this.file = null
			        return
		      	}
		      	this.file = files[0]
			},
			onTranscribe: function (e) {
				if (!this.file) {
					return alert("Please select an audio file.")
				}
				window.ns.utils.watson.uploadFile(this.file, "#txtWatsonTranscript")
			}
		}
	})

	return watson
}("#watson-demo"))