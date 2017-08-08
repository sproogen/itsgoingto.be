<?php

namespace ItsGoingToBeBundle\Tests\Api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\Api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for POST /api/polls
 */
class CreatePollCest extends BaseApiCest
{
    public function checkRouteTest(ApiTester $I)
    {
        $I->wantTo('Check call return 400');
        $I->sendPOST('/polls');
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
    }

    public function returnsErrorMessagesAnd400Test(ApiTester $I)
    {
        $I->wantTo('Check call returns errors');
        $I->sendPOST('/polls');
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'errors' => 'array',
        ]);
        $I->seeResponseContainsJson([
            'errors' => [
                'No question has been provided',
                'No answers have been provided'
            ]
        ]);
    }

    public function returnsPersistedPollTest(ApiTester $I)
    {
        $I->wantTo('Check call returns persisted poll');
        $I->sendPOST('/polls', [
            'question'       => 'Question Text',
            'answers'        => [
                'Answer 1',
                'Answer 2'
            ],
            'multipleChoice' => true
        ]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'id'             => 'integer',
            'identifier'     => 'string',
            'question'       => 'string',
            'multipleChoice' => 'boolean',
            'passphrase'     => 'string',
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
        $I->seeResponseContainsJson([
            'question'       => 'Question Text',
            'multipleChoice' => true,
            'passphrase'     => '',
            'deleted'        => false,
            'responsesCount' => 0,
            'userResponses'  => [],
        ]);
        $I->seeResponsePathContainsJson(
            [
                'answer'         => 'Answer 1',
                'responsesCount' => 0
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
                'answer'         => 'Answer 2',
                'responsesCount' => 0
            ],
            '$.answers[1]'
        );
    }
}
