<!DOCTYPE html>
<html>
<head>
    <title>User Dashboard</title>
</head>
<body>
    <h1>Halo {{ $user->name }}! Ini halaman user.</h1>
    <a href="{{ route('logout') }}">Logout</a>
</body>
</html>
