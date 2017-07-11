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
        $I->seeResponseMatchesJsonType(
            [
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
            '$.entities[*]'
        );
        $I->seeResponseMatchesJsonType(
            [
            'id'   => 'integer',
            'type' => 'string:regex(/Answer/)'
            ],
            '$.entities[*].answers[*]'
        );
    }

    public function returnsPollWithValuesTest(ApiTester $I)
    {
        $I->wantTo('Check returned polls match correct values');
        $I->sendGET('/polls');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
        'count' => 1,
        'total' => 1
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getId(),
            'identifier'     => 'he7gis',
            'question'       => 'Test Question 1',
            'multipleChoice' => false,
            'deleted'        => false,
            'responsesCount' => 2
            ],
            '$.entities[0]'
        );
        $I->seeResponsePathContainsJson(
            [
            'id'   => $this->polls[0]->getAnswers()[0]->getId(),
            'type' => 'Answer'
            ],
            '$.entities[0].answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
            'id'   => $this->polls[0]->getAnswers()[1]->getId(),
            'type' => 'Answer'
            ],
            '$.entities[0].answers[1]'
        );
    }

    public function returnsOnlyNonDeletedPollsTest(ApiTester $I)
    {
        $I->wantTo('Check returned polls are not deleted');
        $I->sendGET('/polls');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
        'count' => 1,
        'total' => 1,
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getId(),
            'identifier'     => 'he7gis',
            'question'       => 'Test Question 1',
            'multipleChoice' => false,
            'deleted'        => false,
            'responsesCount' => 2
            ],
            '$.entities[0]'
        );
    }

    public function returnsDeletedPollsForAdminTest(ApiTester $I)
    {
        $I->wantTo('Check returned polls are not deleted');
        $I->sendGET('/polls', ['user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
        'count' => 2,
        'total' => 2,
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getId(),
            'identifier'     => 'he7gis',
            'question'       => 'Test Question 1',
            'multipleChoice' => false,
            'deleted'        => false,
            'responsesCount' => 2
            ],
            '$.entities[0]'
        );
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[1]->getId(),
            'identifier'     => 'y3k0sn',
            'question'       => 'Test Question Deleted',
            'multipleChoice' => false,
            'deleted'        => true,
            'responsesCount' => 0
            ],
            '$.entities[1]'
        );
    }

    public function returnsPaginatedPollsTest(ApiTester $I)
    {
        for ($x = 0; $x < 50; $x++) {
            $this->polls[] = $this->createPoll($I, [
            'identifier'     => substr(chr(mt_rand(97, 122)) .substr(md5(time()), 1), 0, 6),
            'question'       => 'Test Question',
            'multipleChoice' => false,
            'deleted'        => false,
            'answers'        => [
              'Answer 1',
              'Answer 2'
            ]
            ]);
        }

        $I->wantTo('Check first page of polls are returned');
        $I->sendGET('/polls');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
        'count' => 20,
        'total' => 51,
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[0]->getId(),
            'identifier'     => 'he7gis',
            'question'       => 'Test Question 1',
            'multipleChoice' => false,
            'deleted'        => false,
            'responsesCount' => 2
            ],
            '$.entities[0]'
        );

        $I->wantTo('Check second page of polls are returned');
        $I->sendGET('/polls', ['page' => 2]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
        'count' => 20,
        'total' => 51,
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[21]->getId(),
            'identifier'     => $this->polls[21]->getIdentifier(),
            'question'       => 'Test Question',
            'multipleChoice' => false,
            'deleted'        => false,
            'responsesCount' => 0
            ],
            '$.entities[0]'
        );

        $I->wantTo('Check page size affects returned');
        $I->sendGET('/polls', ['page' => 2, 'pageSize' => 25]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
        'count' => 25,
        'total' => 51,
        ]);
        $I->seeResponsePathContainsJson(
            [
            'id'             => $this->polls[26]->getId(),
            'identifier'     => $this->polls[26]->getIdentifier(),
            'question'       => 'Test Question',
            'multipleChoice' => false,
            'deleted'        => false,
            'responsesCount' => 0
            ],
            '$.entities[0]'
        );
    }
}
