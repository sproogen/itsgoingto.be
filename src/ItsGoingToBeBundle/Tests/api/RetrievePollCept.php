<?php

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for GET /api/polls/:identifier
 */

$I = new ApiTester($scenario);
$I->wantTo('Check call return 404');
$I->sendGet('/polls/he7gis');
$I->seeResponseCodeIs(HttpCode::NOT_FOUND);
$I->seeResponseIsJson();
