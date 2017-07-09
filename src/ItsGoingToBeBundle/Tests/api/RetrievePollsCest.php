<?php

namespace ItsGoingToBeBundle\Tests\api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for GET /api/polls
 */
class RetrievePollsCest extends BaseApiCest
{
  public function checkRouteTest(ApiTester $I)
  {
    $I->wantTo('Check call return 200 and matches json structure');
    $I->sendGET('/polls');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseMatchesJsonType([
      'count'    => 'integer',
      'total'    => 'integer',
      'entities' => 'array'
    ]);
  }

  public function returnsPollTest(ApiTester $I)
  {
    $I->wantTo('Check returned polls match json structure');
    $I->sendGET('/polls');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseMatchesJsonType([
      'id'             => 'integer',
      'identifier'     => 'string',
      'question'       => 'string',
      'multipleChoice' => 'boolean',
      'deleted'        => 'boolean',
      'responsesCount' => 'integer',
      'answers'        => 'array',
      'created'        => [
        'date'          => 'string',
        'timezone_type' => 'integer',
        'timezone'      => 'string'
      ],
      'updated'        => [
        'date'          => 'string',
        'timezone_type' => 'integer',
        'timezone'      => 'string'
      ]
    ],
    '$.entities[*]');
    $I->seeResponseMatchesJsonType([
      'id'   => 'integer',
      'type' => 'string:regex(/Answer/)'
    ],
    '$.entities[*].answers[*]');
  }

  public function returnsPollWithValues(ApiTester $I)
  {
    $I->wantTo('Check returned polls match correct values');
    $I->sendGET('/polls');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseContainsJson([
      'count' => 1,
      'total' => 1
    ]);
    $I->seeResponsePathContainsJson([
      'id'             => $this->polls[0]->getId(),
      'identifier'     => 'he7gis',
      'question'       => 'Test Question 1',
      'multipleChoice' => false,
      'deleted'        => false,
      'responsesCount' => 2
    ],
    '$.entities[0]');
    $I->seeResponsePathContainsJson([
      'id'   => $this->polls[0]->getAnswers()[0]->getId(),
      'type' => 'Answer'
    ],
    '$.entities[0].answers[0]');
    $I->seeResponsePathContainsJson([
      'id'   => $this->polls[0]->getAnswers()[1]->getId(),
      'type' => 'Answer'
    ],
    '$.entities[0].answers[1]');
  }

  public function returnsOnlyNonDeletedPolls(ApiTester $I)
  {
    $I->wantTo('Check returned polls are not deleted');
    $I->sendGET('/polls');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseContainsJson([
      'count' => 1,
      'total' => 1,
    ]);
    $I->seeResponsePathContainsJson([
      'id'             => $this->polls[0]->getId(),
      'identifier'     => 'he7gis',
      'question'       => 'Test Question 1',
      'multipleChoice' => false,
      'deleted'        => false,
      'responsesCount' => 2
    ],
    '$.entities[0]');
  }

  // TODO : Test returns deleted for admin
  // TODO : Test Pagination
}
