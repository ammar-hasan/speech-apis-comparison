window.ns.modules.azure = (function(el) {
	"use strict"
	
	var azure = new Vue({
		el: el,
		data: {
			title: "Azure API",
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
				window.ns.utils.azure.uploadFile(this.file, "#txtAzureTranscript")
			}
		}
	})

	return azure
}("#azure-demo"))