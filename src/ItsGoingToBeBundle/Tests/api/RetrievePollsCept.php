<?php

use ItsGoingToBeBundle\ApiTester;

$I = new ApiTester($scenario);
$I->wantTo('perform actions and see result');
$I->sendGET('/polls');
$I->seeResponseCodeIs(HttpCode::OK);
