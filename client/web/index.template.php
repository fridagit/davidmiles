<?php
include 'admin/authorization.php';
if (!isSSL() && !isLocalhost()) {
    $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: ' . $redirect);
    exit();
}
?>
        
<!DOCTYPE html>
<html lang="en">
<head>

    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- for Google -->
    <meta name="description" content="David Miles är en låtskrivare, gitarrist och sångare uppvuxen i Göteborg men numera bosatt i Malmö. Han har gett ut 3 skivor sedan 2008 (förutom en mängd demoinspelningar). Den senaste skivan Tiden är ett jetplan gavs ut hösten 2012." />
    <meta name="keywords" content="artist trubadur musik" />

    <meta name="author" content="Johan Frick" />
    <meta name="copyright" content="David Miles" />
    <meta name="application-name" content="David Miles" />

    <!-- for Facebook -->
    <meta property="og:title" content="David Miles" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="http://davidmiles.se/favicon/apple-touch-icon-180x180.png" />
    <meta property="og:url" content="http://davidmiles.se" />
    <meta property="og:description" content="David Miles är en låtskrivare, gitarrist och sångare uppvuxen i Göteborg men numera bosatt i Malmö. Han har gett ut 3 skivor sedan 2008 (förutom en mängd demoinspelningar). Den senaste skivan Tiden är ett jetplan gavs ut hösten 2012." />

    <!-- for Twitter -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="David Miles" />
    <meta name="twitter:description" content="David Miles är en låtskrivare, gitarrist och sångare uppvuxen i Göteborg men numera bosatt i Malmö. Han har gett ut 3 skivor sedan 2008 (förutom en mängd demoinspelningar). Den senaste skivan Tiden är ett jetplan gavs ut hösten 2012." />
    <meta name="twitter:image" content="http://davidmiles.se/favicon/apple-touch-icon-180x180.png" />

    <title>David Miles</title>

    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>

    <link rel="import" href="bower_components/paper-material/paper-material.html">

    {{#css}}
    <link rel="stylesheet" href="{{.}}">
    {{/css}}

    {{#libs}}
    <script src="{{.}}"></script>
    {{/libs}}

    <script src="{{cogwheels}}"></script>
    <script src="{{gears}}"></script>

    <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon-180x180.png">
    <link rel="shortcut icon" href="/favicon/favicon.ico">
    <link rel="icon" type="image/png" href="/favicon/favicon-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/favicon/favicon-160x160.png" sizes="160x160">
    <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/favicon/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="/favicon/favicon-32x32.png" sizes="32x32">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="/favicon/mstile-144x144.png">
    <meta name="msapplication-config" content="/favicon/browserconfig.xml">
</head>
<body>
<div id="site"></div>
<script type='text/javascript'>

    $(document).ready(function () {
        $('[data-toggle=offcanvas]').click(function () {
            $('.row-offcanvas').toggleClass('active');
        });
    });

    require('message-bus').subscribe('system-error', function (msg) {
        throw message.data;
    });
    cogwheels.start();
</script>

</body>
</html>