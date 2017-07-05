<?php

namespace ItsGoingToBeBundle\Tests\Api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\Api\BaseApiCest;
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
      'id' => 'integer',
      'type' => 'string:regex(/Answer/)',
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
      'total' => 1,
    ]);
    $I->seeResponsePathContainsJson([
      'identifier'     => 'he7gis',
      'question'       => 'Test Question 1',
      'multipleChoice' => false,
      'deleted'        => false,
      'responsesCount' => 0
    ],
    '$.entities[0]');
  }

  public function returnsOnlyNonDeletedPolls(ApiTester $I)
  {
    $this->createPoll($I, [
      'identifier'     => 'h1f4sa',
      'question'       => 'Test Question Deleted',
      'multipleChoice' => false,
      'deleted'        => true,
      'answers'        => [
        'Answer 1',
        'Answer 2'
      ]
    ]);

    $I->wantTo('Check returned polls are not deleted');
    $I->sendGET('/polls');
    $I->seeResponseCodeIs(HttpCode::OK);
    $I->seeResponseIsJson();
    $I->seeResponseContainsJson([
      'count' => 1,
      'total' => 1,
    ]);
    $I->seeResponsePathContainsJson([
      'identifier'     => 'he7gis',
      'question'       => 'Test Question 1',
      'multipleChoice' => false,
      'deleted'        => false,
      'responsesCount' => 0
    ],
    '$.entities[0]');
  }

  // TODO : Test returns deleted for admin
  // TODO : Test Pagination
}
