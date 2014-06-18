var auth_url      = 'https://accounts.spotify.com/authorize',
    client_id     = 'f880219b69b349bf8683bbcd1091410a',
    redirect_uri  = 'http://spotify-exporter.lancebatson.me',
    response_type = 'token',
    scopes        = 'user-read-private';

$('#test').on('click', function() {
  var encoded_url = auth_url + '?';
  encoded_url += $.param({
    client_id: client_id,
    redirect_uri: redirect_uri,
    response_type: response_type,
    scope: scopes
  });
  console.log(encoded_url);
  window.location.href = encoded_url;
});
