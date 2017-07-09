<?php

namespace ItsGoingToBeBundle\Tests\api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for GET /api/polls
 */
class UpdateResponsesCest extends BaseApiCest
{
  public function checkRouteTest(ApiTester $I)
  {
    $I->wantTo('Check call return 200');
    $I->sendGET('/polls');
    $I->seeResponseCodeIs(HttpCode::OK);
  }
}

// TODO : All of this
