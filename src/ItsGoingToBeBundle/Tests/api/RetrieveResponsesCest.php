<?php

namespace ItsGoingToBeBundle\Tests\api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for GET /api/polls/:identifier/responses
 */
class RetrieveResponsesCest extends BaseApiCest
{
  public function checkRouteTest(ApiTester $I)
  {
    $I->wantTo('Check call return 200');
    $I->sendGET('/polls/he7gis/responses');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
  }

  public function returns404Test(ApiTester $I)
  {
    $I->wantTo('Check call return 404');
    $I->sendGet('/polls/y3k0sn/responses');
    $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
    $I->seeResponseIsJson();
  }

  public function returnsResponsesTest(ApiTester $I)
  {
    $I->wantTo('Check returned responses match json structure');
    $I->sendGET('/polls/he7gis/responses');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseMatchesJsonType([
      'responsesCount' => 'integer',
      'answers'        => 'array',
      'userResponses'  => 'array'
    ]);
    $I->seeResponseMatchesJsonType([
      'id'             => 'integer',
      'responsesCount' => 'integer'
    ],
    '$.answers[*]');
  }

  public function returnsResponsesWithValues(ApiTester $I)
  {
    $I->wantTo('Check returned responses match correct values');
    $I->sendGET('/polls/he7gis/responses');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseContainsJson([
      'responsesCount' => 2,
      'userResponses'  => [],
    ]);
    $I->seeResponsePathContainsJson([
      'id'             => $this->polls[0]->getAnswers()[0]->getId(),
      'responsesCount' => 2
    ],
    '$.answers[0]');
    $I->seeResponsePathContainsJson([
      'id'             => $this->polls[0]->getAnswers()[1]->getId(),
      'responsesCount' => 0
    ],
    '$.answers[1]');
  }

  public function returnsUsersResponsesWithValues(ApiTester $I)
  {
    $I->sendPOST('/polls/he7gis/responses', [
      'answers' => [
        $this->polls[0]->getAnswers()[1]->getId()
      ]
    ]);

    $I->wantTo('Check returned responses include users responses');
    $I->sendGET('/polls/he7gis/responses');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseContainsJson([
      'responsesCount' => 3,
      'userResponses'  => [$this->polls[0]->getAnswers()[1]->getId()],
    ]);
    $I->seeResponsePathContainsJson([
      'id'             => $this->polls[0]->getAnswers()[0]->getId(),
      'responsesCount' => 2
    ],
    '$.answers[0]');
    $I->seeResponsePathContainsJson([
      'id'             => $this->polls[0]->getAnswers()[1]->getId(),
      'responsesCount' => 1
    ],
    '$.answers[1]');
  }
}
