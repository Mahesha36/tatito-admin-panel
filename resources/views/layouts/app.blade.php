<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>@yield('title', 'Tatito Fashion')</title>

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}" />
    
</head>
<body>

@include('partials.header')

@yield('content')

@include('partials.footer')

<script src="{{ asset('js/data.js') }}"></script>
<script src="{{ asset('js/catalog.js') }}"></script>
<script src="{{ asset('js/location.js') }}"></script>
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/shop.js') }}"></script>
<script src="{{ asset('js/auth.js') }}"></script>
 

</body>
</html>