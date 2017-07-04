<?php

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for DELETE /api/polls/:identifier
 */

$I = new ApiTester($scenario);
$I->wantTo('Check call return 401');
$I->sendDelete('/polls/he7gis');
$I->seeResponseCodeIs(HttpCode::UNAUTHORIZED);
$I->seeResponseIsJson();
