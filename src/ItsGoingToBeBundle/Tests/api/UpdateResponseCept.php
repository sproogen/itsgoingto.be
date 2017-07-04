<?php

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for GET /api/polls
 */

$I = new ApiTester($scenario);
$I->wantTo('Check call return 200');
$I->sendGET('/polls');
$I->seeResponseCodeIs(HttpCode::OK);
