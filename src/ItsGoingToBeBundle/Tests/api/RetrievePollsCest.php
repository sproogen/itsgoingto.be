<?php

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\ApiTester;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;

/**
 * API Tests for GET /api/polls
 */
class RetrievePollsCest
{
  public function _before(ApiTester $I)
  {
    $pollId = $I->haveInRepository(Poll::class, [
      'identifier'     => 'he7gis',
      'question'       => 'Test Question 1',
      'multipleChoice' => false,
      'deleted'        => false,
    ]);
    $em = $I->getEntityManager();
    $poll = $em->find(Poll::class, $pollId);
    $answerId = $I->haveInRepository(Answer::class, [
      'answer' => 'Answer Text',
      'poll'   => $poll,
    ]);
    $answer = $em->find(Answer::class, $answerId);
    $poll->addAnswer($answer);
    $I->persistEntity($poll);
  }

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
}
