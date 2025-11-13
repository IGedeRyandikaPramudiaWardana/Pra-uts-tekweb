<!DOCTYPE html>
<html>
    <div>
        <meta charset="UTF-8">
        <head>
        <title>Login</title>
        </head>    
    </div>
    <head>
        <title>Login</title>
    </head>

    <div>
        <body>
            <div>
                <h2>Selamat datang di halaman Login</h2>
            </div>

            <div>
                <form method="POST" action="{{ route('login.submit') }}">
                    @csrf
                    <label for="">Username atau Email</label>
                    <input type="text" name="login" required><br>

                    <label for="">Password</label>
                    <input type="password" name="password" required><br>

                    <button type="submit">Login</button>
                </form>
            </div>
        
        
        </body>
    </div>
    
</html>