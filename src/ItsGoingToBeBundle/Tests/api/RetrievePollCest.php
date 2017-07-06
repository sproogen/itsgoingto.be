<?php

namespace ItsGoingToBeBundle\Tests\api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for GET /api/polls/:identifier
 */
class RetrievePollCest extends BaseApiCest
{
  public function checkRouteTest(ApiTester $I)
  {
    // $I = new ApiTester($scenario);
    $I->wantTo('Check call return 200');
    $I->sendGet('/polls/he7gis');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
  }

  public function checkRoute404Test(ApiTester $I)
  {
    // $I = new ApiTester($scenario);
    $I->wantTo('Check call return 404');
    $I->sendGet('/polls/h2gUis');
    $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
    $I->seeResponseIsJson();
  }
}

// TODO : Test returns correct values - answers extracted
// TODO : Test returns deleted for admin
// TODO : Test returns correct format
