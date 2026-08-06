@extends('layouts.app')

@section('title', 'Home')

@section('content')


<main class="auth-page">
    <div class="auth-card">
        <p class="eyebrow">Join Tatito</p>
        <h1>Create your account</h1>
        <p class="auth-text">Sign up for a tailored fashion experience with saved favorites and smarter recommendations.</p>
        <form class="auth-form">
            <label>
                Full name
                <input type="text" placeholder="Your full name" required />
            </label>
            <label>
                Email
                <input type="email" placeholder="you@example.com" required />
            </label>
            <label>
                Password
                <input type="password" placeholder="Choose a strong password" required />
            </label>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <p class="auth-switch">Already have an account? <a href="login.html">Login</a></p>
    </div>
</main>

@endsection