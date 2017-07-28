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
        $I->sendGET('/polls', ['user' => 'admin']);
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
        $I->sendGET('/polls', ['user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType(
            [
                'id'             => 'integer',
                'identifier'     => 'string',
                'question'       => 'string',
                'multipleChoice' => 'boolean',
                'passphrase'     => 'string',
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
        $I->sendGET('/polls', ['user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'count' => 2,
            'total' => 2
        ]);
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getId(),
                'identifier'     => 'he7gis',
                'question'       => 'Test Question 1',
                'multipleChoice' => false,
                'passphrase'     => '',
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

    public function returnsPaginatedPollsTest(ApiTester $I)
    {
        for ($x = 0; $x < 50; $x++) {
            $this->polls[] = $this->createPoll($I, [
                'identifier'     => substr(chr(mt_rand(97, 122)) .substr(md5(time()), 1), 0, 6),
                'question'       => 'Test Question',
                'multipleChoice' => false,
                'passphrase'     => '',
                'deleted'        => false,
                'answers'        => [
                    'Answer 1',
                    'Answer 2'
                ]
            ]);
        }

        $I->wantTo('Check first page of polls are returned');
        $I->sendGET('/polls', ['user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'count' => 20,
            'total' => 52,
        ]);
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getId(),
                'identifier'     => 'he7gis',
                'question'       => 'Test Question 1',
                'multipleChoice' => false,
                'passphrase'     => '',
                'deleted'        => false,
                'responsesCount' => 2
            ],
            '$.entities[0]'
        );

        $I->wantTo('Check second page of polls are returned');
        $I->sendGET('/polls', ['page' => 2, 'user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'count' => 20,
            'total' => 52,
        ]);
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[20]->getId(),
                'identifier'     => $this->polls[20]->getIdentifier(),
                'question'       => 'Test Question',
                'multipleChoice' => false,
                'passphrase'     => '',
                'deleted'        => false,
                'responsesCount' => 0
            ],
            '$.entities[0]'
        );

        $I->wantTo('Check page size affects returned');
        $I->sendGET('/polls', ['page' => 2, 'pageSize' => 25, 'user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'count' => 25,
            'total' => 52,
        ]);
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[25]->getId(),
                'identifier'     => $this->polls[25]->getIdentifier(),
                'question'       => 'Test Question',
                'multipleChoice' => false,
                'passphrase'     => '',
                'deleted'        => false,
                'responsesCount' => 0
            ],
            '$.entities[0]'
        );
    }
}
