var access_token = '';
var registration_id = '';

function registerCallback(registrationId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError);
    return;
  }

  document.getElementById('status').innerHTML = registrationId;
  // Send the registration token to your application server.
  sendRegistrationId(registrationId, function(succeed) {
    console.log('Successful registration');
  });
}

function sendRegistrationId(registrationId, callback) {
  // chrome.storage.local.get("access_token", function (token) {
  // alert('There is access token:' + token.access_token);
  // });
  if (access_token) {
    $.ajax({
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
      },
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        'device': {
          'registration_id': registrationId,
          'description': 'Chrome extension'
        }
      }),
      success: function(res) {
        registration_id = res.devices[0].registration_id;
        document.getElementById('resp').innerHTML = res.devices[0].id + ': ' + registration_id;
        console.log(res)
      },
      url: 'http://localhost:8000/api/devices',
      error: function(e) {
        console.log(e);
      }
    });

  } else {
    alert("Something went wrong, empty access_token")
  }
}

function registerStepicClient() {
  var senderIds = ["379738472939"];
  chrome.gcm.register(senderIds, registerCallback);
}

function unregisterStepicClient() {
  chrome.gcm.unregister(unregisterCallback);
}

function unregisterCallback() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError)
    return;
  }
  $.ajax({
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    },
    type: 'GET',
    url: 'http:localhost:8000/api/devices',
    data: 'registration_id=' + registration_id,
    success: function(res) {
      var deviceId = res.devices[0].id;
      console.log(deviceId);
      $.ajax({
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        },
        type: 'DELETE',
        success: function(res) {
          document.getElementById('resp').innerHTML = 'Device ' + deviceId + ' was deleted from backend';
          console.log(res)
        },
        url: 'http://localhost:8000/api/devices/' + deviceId,
        error: function(e) {
          console.log(e);
        }
      });
    }
  });
  document.getElementById('status').innerHTML = "Registration was cleared";
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("register_button").addEventListener("click", registerStepicClient);
  document.getElementById("unregister_button").addEventListener("click", unregisterStepicClient);
  $.ajax({
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa("yon6sNg3xifYMKyiHx4LBKC12nmL1ymYz1pxMfKo:aYBVy6XGRTqDXdFqpvEjKapIYnEanwOXLi3V2RRx9IdKbyGmtO45Adx1nELzEGRargujXUQnCQLPannbdlEMCBXJHtCMOgpZM8FRBFqgNs7rTLQX2VG9tcw4sGXJ3kkj"));
    },
    type: 'POST',
    data: 'grant_type=client_credentials',
    success: function(res) {
      // chrome.storage.local.set({
      // access_token: res.access_token
      // });
      access_token = res.access_token;
    },
    url: 'http://localhost:8000/oauth2/token/',
    error: function() {
      alert("some error");
    }
  });
});
