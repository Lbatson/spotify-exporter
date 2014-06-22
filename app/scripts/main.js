var authUrl      = 'https://accounts.spotify.com/authorize',
    apiUrl       = 'https://api.spotify.com/v1',
    clientId     = 'f880219b69b349bf8683bbcd1091410a',
    redirectUri  = 'http://localhost:9000',
    responseType = 'token',
    scopes       = 'playlist-read-private',
    accessToken  = '',
    user         = {},
    playlist     = {};

function displayPlaylistItems() {
  $('#results').empty();
  var template = Handlebars.compile($('#playlist-list').html());
  $('#results').append(template(playlist.items));
}

function retrieveUserAndPlaylist() {
  $.ajax({
    url: apiUrl + '/me',
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
  .then(function(userInfo) {
    user = userInfo;
    return $.ajax({
      url: apiUrl + '/users/' + user.id + '/playlists',
      headers: { 'Authorization': 'Bearer ' + accessToken }
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

jQuery.extend({
  getQueryParameters: function(str) {
    return (str || document.location.search).replace(/(^\?)/,'').split('&').map(
      function(n){return n = n.split('='),this[n[0]] = n[1],this}.bind({})
    )[0];
  }
});

$('#authorize').on('click', function() {
  var encodedUrl = authUrl + '?';
  encodedUrl += $.param({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope: scopes
  });
  window.location.href = encodedUrl;
});

$(document).on('click', '.export', function() {
  if ($(this).data('owner') === user.id || $(this).data('ispublic')) {
    var playlistId = $(this).data('id');
    $.ajax({
      url: apiUrl + '/users/' + user.id + '/playlists/'+ playlistId + '/tracks',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(function(result) {
      $('#results').empty();
      var template = Handlebars.compile($('#playlist-list-items').html());
      $('#results').append(template(result.items));
    })
    .fail(function(err) {
      console.log(err);
    });
  } else {
    alert('Unable to export private playlist from another user');
  }
});

$(function() {
  var url = window.location.href;
  if (url.search('#access_token') !== -1) {
    $('#authorize').hide();
    var params = url.split('#')[1];
    params = $.getQueryParameters(params);
    accessToken = params.access_token;
    retrieveUserAndPlaylist();
  }
});
