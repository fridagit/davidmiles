<?php
include 'authorization.php';

if (isAuthorized()) {
    $name = urldecode($_GET["name"]);
    if (!IsNullOrEmptyString($name)) {
        $body = file_get_contents('php://input');
        file_put_contents(__DIR__ . "/../txt/" . $name . ".txt", $body);
    }
}

function IsNullOrEmptyString($question)
{
    return (!isset($question) || trim($question) === '');
}