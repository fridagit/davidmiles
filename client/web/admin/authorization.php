<?php
function isAuthorized()
{
    $isAuthorized = isPasswordValid() && (isSSL() || isLocalhost());
    if (!$isAuthorized) {
        header("HTTP/1.1 401 Unauthorized");
    }
    return $isAuthorized;
}

function isPasswordValid()
{
    $password = urldecode($_GET["password"]);
    return password_verify($password, '$2y$10$90dTds86VtF5Wtg5hhK9c.KCXKD3rM.f.EeTirLPT457Jus05IQzS');
}

function isSSL()
{
    return !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off';
}

function isLocalhost()
{
    $whitelist = array('127.0.0.1', "::1");
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}