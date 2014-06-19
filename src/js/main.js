var auth_url      = 'https://accounts.spotify.com/authorize',
    api_url       = 'https://api.spotify.com/v1',
    client_id     = 'f880219b69b349bf8683bbcd1091410a',
    redirect_uri  = 'http://localhost:8000',
    response_type = 'token',
    scopes        = 'playlist-read-private',
    access_token  = '',
    user          = {},
    playlist      = {};

$(function() {
  var url = window.location.href;
  if (url.search('#access_token') !== -1) {
    $('#authorize').hide();
    var params = url.split('#')[1];
    params = $.getQueryParameters(params);
    access_token = params.access_token;
    retrieveUserAndPlaylist();
  }
});

$('#authorize').on('click', function() {
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

function retrieveUserAndPlaylist() {
  $.ajax({
     url: api_url + '/me',
     headers: { 'Authorization': 'Bearer ' + access_token }
  })
  .then(function(userInfo) {
    user = userInfo;
    return $.ajax({
      url: api_url + '/users/' + user.id + '/playlists',
      headers: { 'Authorization': 'Bearer ' + access_token }
    });
  })
  .then(function(playlistInfo) {
    playlist = playlistInfo;
    console.log(playlistInfo);
    displayPlaylistItems();
  })
  .fail(function(err) {
    console.log(err);
  });
}

function displayPlaylistItems() {
  $('#results').empty();
  var template = Handlebars.compile($("#playlist-list").html());
  $('#results').append(template(playlist.items));
}

$(document).on('click', '.export', function() {
  var playlist_id = $(this).data("id");
  $.ajax({
    url: api_url + '/users/' + user.id + '/playlists/'+ playlist_id + '/tracks',
    headers: { 'Authorization': 'Bearer ' + access_token }
  })
  .then(function(result) {
    $('#results').empty();
    var template = Handlebars.compile($("#playlist-list-items").html());
    $('#results').append(template(result.items));
  })
  .fail(function(err) {
    console.log(err);
  });
});
