var auth_url      = 'https://accounts.spotify.com/authorize',
    client_id     = 'f880219b69b349bf8683bbcd1091410a',
    redirect_uri  = 'http://localhost:8000',
    response_type = 'token',
    scopes        = 'playlist-read-private',
    access_token  = '';

$(function() {
  var url = window.location.href;
  if (url.search('#access_token') !== -1) {
    var params = url.split('#')[1];
    params = $.getQueryParameters(params);
    console.log(params);
    access_token = params.access_token;
    retrieveUserInfo();
  }
});

$('#test').on('click', function() {
  var encoded_url = auth_url + '?';
  encoded_url += $.param({
    client_id: client_id,
    redirect_uri: redirect_uri,
    response_type: response_type,
    scope: scopes
  });
  window.location.href = encoded_url;
});

jQuery.extend({
  getQueryParameters: function(str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(
      function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({})
    )[0];
  }
});

function retrieveUserInfo() {
  $.ajax({
     url: 'https://api.spotify.com/v1/me',
     headers: {
         'Authorization': 'Bearer ' + access_token
     },
     success: function(response) {
      retrievePlaylists(response.id);
     }
  });
}

function retrievePlaylists(userID) {
  $.ajax({
     url: 'https://api.spotify.com/v1/users/' + userID + '/playlists',
     headers: {
         'Authorization': 'Bearer ' + access_token
     },
     success: function(response) {
      console.log(response);
     }
  });
}
