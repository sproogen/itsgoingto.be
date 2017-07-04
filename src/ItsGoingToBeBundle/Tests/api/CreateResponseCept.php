<?php

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for POST /api/polls/:identifier/responses
 */

$I = new ApiTester($scenario);
$I->wantTo('Check call return 404');
$I->sendPOST('/polls/he7gis/responses');
$I->seeResponseCodeIs(HttpCode::NOT_FOUND);
$I->seeResponseIsJson();
