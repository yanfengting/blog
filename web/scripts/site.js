function login(){
    var returnUrl = location.origin + location.pathname;
    location.href = `${location.origin}/user/login.html?returnUrl=${returnUrl}`;
}

function register() {
    var returnUrl = location.origin + location.pathname;
    location.href = `${location.origin}/user/register.html?returnUrl=${returnUrl}`;
}