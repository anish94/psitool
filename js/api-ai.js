//J3MMSupport
//ef6ca3d237634a1680ddaebd1698117f
var clientAccessToken = "ef6ca3d237634a1680ddaebd1698117f";
var accessToken = clientAccessToken;
var baseUrl = "https://api.api.ai/api/";
var sessionId = Math.floor((Math.random() * 10000000000000) + 1);

$(document).ready(function() {
	$("#input").keypress(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			send();
		}
	});
	$("#rec").click(function(event) {
		switchRecognition();
	});
});
var recognition;
function startRecognition() {
	recognition = new webkitSpeechRecognition();
	recognition.onstart = function(event) {
		updateRec();
	};
	recognition.onresult = function(event) {
		var text = "";
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			text += event.results[i][0].transcript;
		}
		setInput(text);
		stopRecognition();
	};
	recognition.onend = function() {
		stopRecognition();
	};
	recognition.lang = "en-US";
	recognition.start();
}

function stopRecognition() {
	if (recognition) {
		recognition.stop();
		recognition = null;
	}
	updateRec();
}
function switchRecognition() {
	if (recognition) {
		stopRecognition();
	} else {
		startRecognition();
	}
}
function setInput(text) {
	$("#input").val(text);
	
	send();
}
function updateRec() {
	$("#rec").text(recognition ? "Stop" : "Speak");
}
function send() {
	var text = $("#input").val();
	setPersonDialog(text);
	$.ajax({
		type : "POST",
		url : baseUrl + "query?v=20150910",
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		headers : {
			"Authorization" : "Bearer " + accessToken
		},
		data : JSON.stringify({
			query : text,
			lang : "en",
			sessionId : sessionId
		}),
		success : function(data) {
			setResponse(data);
		},
		error : function() {
			setResponse("Internal Server Error");
		}
	});
	//setResponse("Loading...");
}
function setResponse(val) {
	//$("#response").text(val);
	setBotDialog(val);
}

//custom
function setPersonDialog(val){
	$("#chatTextArea").append("<div class=\"perReply\"><div class=\"perImg\"><span >You</span></div><div class=\"clear\"></div><div class=\"ask\"><div class=\"perAskText\">"+val+"</div></div><div class=\"clear\"></div></div>");
	$('#chatTextArea').animate({scrollTop: $('#chatTextArea').prop('scrollHeight')});
}
function setBotDialog(val){
	//console.log(val);
	var response = val.result.fulfillment.speech;
	$("#chatTextArea").append("<div class=\"botReply\"><div class=\"botImg\"><span ><img src=\"images/bot-header.png\" /></span></div><div class=\"clear\"></div><div class=\"reply\"><div class=\"botReplyText\">"+response+"</div></div><div class=\"clear\"></div></div>");
	$("#input").val("");
	$("#botReply").last().focus();	
    $('#chatTextArea').animate({scrollTop: $('#chatTextArea').prop('scrollHeight')});

}
