<?php

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\ApiTester;

$I = new ApiTester($scenario);
$I->wantTo('Check call return 200');
$I->sendGET('/polls');
$I->seeResponseCodeIs(HttpCode::OK);
