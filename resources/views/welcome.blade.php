<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>{{ config('app.name') }}</title>

  <link type="text/css" href="{{ mix('index.css') }}" rel="stylesheet" />
</head>
<body>
  <noscript>
    <strong>We're sorry but frontend doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
  </noscript>
  <div id="root"></div>
  <script src="{{ mix('index.js') }}"></script>
</body>
</html>
