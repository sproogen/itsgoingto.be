<?php
if(isset($_ENV['JAWSDB_URL'])){
    $db = parse_url($_ENV['JAWSDB_URL']);
    $container->setParameter('database_driver', 'pdo_mysql');
    $container->setParameter('database_host', $db['host']);
    $container->setParameter('database_port', '~');
    $container->setParameter('database_name', trim($db['path'], '/'));
    $container->setParameter('database_user', $db['user']);
    $container->setParameter('database_password', $db['pass']);
}

if(isset($_ENV['SECRET'])){
    $container->setParameter('secret', $_ENV['SECRET']);
}

if(isset($_ENV['JWT_PASS_PHRASE'])){
    $container->setParameter('jwt_key_pass_phrase', $_ENV['JWT_PASS_PHRASE']);
}
