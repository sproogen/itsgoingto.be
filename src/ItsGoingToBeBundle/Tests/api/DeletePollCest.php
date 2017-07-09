<?php

namespace ItsGoingToBeBundle\Tests\api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for DELETE /api/polls/:identifier
 */
class DeletePollCest extends BaseApiCest
{
  public function checkRouteTest(ApiTester $I)
  {
    $I->wantTo('Check call return 401');
    $I->sendDelete('/polls/he7gis');
    $I->seeResponseCodeIs(HttpCode::UNAUTHORIZED);
    $I->seeResponseIsJson();
  }
}

// TODO : Test can delete poll as admin
