<?php

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for POST /api/polls
 */

$I = new ApiTester($scenario);
$I->wantTo('Check call return 400');
$I->sendPOST('/polls');
$I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
$I->seeResponseIsJson();
