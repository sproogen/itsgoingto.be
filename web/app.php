<?php

use Symfony\Component\HttpFoundation\Request;

// Loading the react app here to save bootstraping symfony.
if (substr( $_SERVER['REQUEST_URI'], 0, 6 ) !== "/admin" && substr( $_SERVER['REQUEST_URI'], 0, 4 ) !== "/api") {
    if (
        !strpos($_SERVER["HTTP_USER_AGENT"], "facebookexternalhit/") !== false &&
        !strpos($_SERVER["HTTP_USER_AGENT"], "Facebot") !== false &&
        !strpos($_SERVER["HTTP_USER_AGENT"], "Twitterbot") !== false
    ) {
        readfile("client/index.html");
        exit(0);
    }
}

/** @var \Composer\Autoload\ClassLoader $loader */
$loader = require __DIR__.'/../vendor/autoload.php';
if (PHP_VERSION_ID < 70000) {
    include_once __DIR__.'/../var/bootstrap.php.cache';
}

$kernel = new AppKernel('prod', false);
if (PHP_VERSION_ID < 70000) {
    $kernel->loadClassCache();
}
//$kernel = new AppCache($kernel);

// When using the HttpCache, you need to call the method in your front controller instead of relying on the configuration parameter
//Request::enableHttpMethodParameterOverride();
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
