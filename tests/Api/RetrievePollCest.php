<?php

namespace App\Tests\Api;

use Codeception\Util\HttpCode;
use App\Tests\Api\BaseApiCest;

/**
 * API Tests for GET /api/polls/:identifier
 */
class RetrievePollCest extends BaseApiCest
{
    public function checkRouteTest(\ApiTester $I)
    {
        $I->wantTo('Check call return 200');
        $I->sendGet('/polls/he7gis');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
    }

    public function returns404Test(\ApiTester $I)
    {
        $I->wantTo('Check call return 404');
        $I->sendGet('/polls/h2gUis');
        $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
        $I->seeResponseIsJson();
    }

    public function returnsPollTest(\ApiTester $I)
    {
        $I->wantTo('Check returned polls match json structure');
        $I->sendGET('/polls/he7gis');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'id'             => 'integer',
            'identifier'     => 'string',
            'question'       => 'string',
            'multipleChoice' => 'boolean',
            'passphrase'     => 'string',
            'ended'          => 'boolean',
            'deleted'        => 'boolean',
            'responsesCount' => 'integer',
            'answers'        => 'array',
            'userResponses'  => 'array',
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
        ]);
        $I->seeResponseMatchesJsonType(
            [
                'id'             => 'integer',
                'answer'         => 'string',
                'responsesCount' => 'integer',
                'poll'           => [
                    'id'   => 'integer',
                    'type' => 'string:regex(/Poll/)',
                ]
            ],
            '$.answers[*]'
        );
    }

    public function returnsPollWithValues(\ApiTester $I)
    {
        $I->wantTo('Check returned poll match correct values');
        $I->sendGET('/polls/he7gis');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'id'             => $this->polls[0]->getId(),
            'identifier'     => 'he7gis',
            'question'       => 'Test Question 1',
            'multipleChoice' => false,
            'passphrase'     => '',
            'ended'          => false,
            'deleted'        => false,
            'responsesCount' => 2,
            'userResponses'  => [],
        ]);
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getAnswers()[0]->getId(),
                'answer'         => 'Answer 1',
                'responsesCount' => 2
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getAnswers()[1]->getId(),
                'answer'         => 'Answer 2',
                'responsesCount' => 0
            ],
            '$.answers[1]'
        );
        $I->seeResponsePathContainsJson(
            [
                'id'   => $this->polls[0]->getId(),
                'type' => 'Poll'
            ],
            '$.answers[*].poll'
        );
    }

    public function returns404ForDeletedTest(\ApiTester $I)
    {
        $I->wantTo('Check call returns 404');
        $I->sendGet('/polls/y3k0sn');
        $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
        $I->seeResponseIsJson();
    }

    public function returnsDeletedPollForAdminTest(\ApiTester $I)
    {
        $user = $this->createUser($I, [
            'username' => 'admin',
            'password' => 'password123'
        ]);
        $token = $this->getTokenForUser($I, $user);
        $I->amBearerAuthenticated($token);

        $I->wantTo('Check call returns deleted poll');
        $I->sendGet('/polls/y3k0sn');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'id'             => $this->polls[1]->getId(),
            'identifier'     => 'y3k0sn',
            'question'       => 'Test Question Deleted'
        ]);
    }

    public function returnsErrorAnd403ForPassphraseTest(\ApiTester $I)
    {
        $this->polls[] = $this->createPoll($I, [
            'identifier'     => 'ic8ans',
            'question'       => 'Test Question Passphrase',
            'multipleChoice' => false,
            'passphrase'     => 'Passphrase',
            'deleted'        => false,
            'answers'        => [
                'Answer Passphrase 1',
                'Answer Passphrase 2'
            ]
        ]);

        $I->wantTo('Check call return 403');
        $I->sendGet('/polls/ic8ans');
        $I->seeResponseCodeIs(HttpCode::FORBIDDEN);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'error' => 'string',
        ]);
        $I->seeResponseContainsJson([
            'error' => 'incorrect-passphrase'
        ]);
    }

    public function returnsPollWithPassphraseTest(\ApiTester $I)
    {
        $this->polls[] = $this->createPoll($I, [
            'identifier'     => 'ic8ans',
            'question'       => 'Test Question Passphrase',
            'multipleChoice' => false,
            'passphrase'     => 'Passphrase',
            'deleted'        => false,
            'answers'        => [
                'Answer Passphrase 1',
                'Answer Passphrase 2'
            ]
        ]);

        $I->wantTo('Check returned polls match json structure');
        $I->sendGET('/polls/ic8ans?passphrase=Passphrase');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'id'             => 'integer',
            'identifier'     => 'string',
            'question'       => 'string',
            'multipleChoice' => 'boolean',
            'passphrase'     => 'string',
            'ended'          => 'boolean',
            'deleted'        => 'boolean',
            'responsesCount' => 'integer',
            'answers'        => 'array',
            'userResponses'  => 'array',
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
        ]);
        $I->seeResponseMatchesJsonType(
            [
                'id'             => 'integer',
                'answer'         => 'string',
                'responsesCount' => 'integer',
                'poll'           => [
                    'id'   => 'integer',
                    'type' => 'string:regex(/Poll/)',
                ]
            ],
            '$.answers[*]'
        );
    }

    public function endsPollAndreturnsEndedPollTest(\ApiTester $I)
    {
        $now = new \DateTime();
        $this->polls[] = $this->createPoll($I, [
            'identifier'     => '5gfd8u',
            'question'       => 'Test Question End',
            'multipleChoice' => false,
            'passphrase'     => '',
            'endDate'        => $now,
            'deleted'        => false,
            'answers'        => [
                'Answer Passphrase 1',
                'Answer Passphrase 2'
            ]
        ]);

        $I->sendGET('/polls/5gfd8u');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'id'             => $this->polls[2]->getId(),
            'identifier'     => '5gfd8u',
            'question'       => 'Test Question End',
            'multipleChoice' => false,
            'passphrase'     => '',
            'ended'          => true,
            'deleted'        => false,
            'responsesCount' => 0,
            'userResponses'  => [],
        ]);
    }
}
