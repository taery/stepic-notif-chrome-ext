function getNotificationId() {
	var id = Math.floor(Math.random() * 9007199254740992) + 1;
	return id.toString();
}
chrome.gcm.onMessage.addListener(function(message) {
	var messageString = "";
	for (var key in message.data) {
		if (messageString != "")
			messageString += ", "
		messageString += key + ":" + message.data[key];
	}
	chrome.notifications.create(getNotificationId(), {
		title: message.data['title'],
		iconUrl: 'quote.png',
		type: 'basic',
		message: message.data['message']
	}, function() {});
});