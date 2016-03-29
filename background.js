function getNotificationId() {
	var id = Math.floor(Math.random() * 9007199254740992) + 1;
	return id.toString();
}
chrome.gcm.onMessage.addListener(function(message) {

	chrome.notifications.create(getNotificationId(), {
		title: message.data['gcm.notification.title'],
		iconUrl: 'quote.png',
		type: 'basic',
		message: message.data['gcm.notification.body']
	}, function() {});
});