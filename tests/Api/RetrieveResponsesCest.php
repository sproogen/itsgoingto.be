<?php

namespace App\Tests\Api;

use Codeception\Util\HttpCode;
use App\Tests\Api\BaseApiCest;

/**
 * API Tests for GET /api/polls/:identifier/responses
 */
class RetrieveResponsesCest extends BaseApiCest
{
    public function checkRouteTest(\ApiTester $I)
    {
        $I->wantTo('Check call return 200');
        $I->sendGET('/polls/he7gis/responses');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
    }

    public function returns404Test(\ApiTester $I)
    {
        $I->wantTo('Check call return 404');
        $I->sendGet('/polls/y3k0sn/responses');
        $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
        $I->seeResponseIsJson();
    }

    public function returns404DeletedPollTest(\ApiTester $I)
    {
        $this->polls[] = $this->createPoll($I, [
            'identifier'     => 'as46hg',
            'question'       => 'Test Question Deleted',
            'multipleChoice' => false,
            'passphrase'     => 'Passphrase',
            'deleted'        => true,
            'answers'        => [
                'Answer Passphrase 1',
                'Answer Passphrase 2'
            ]
        ]);

        $I->wantTo('Check call return 404 for deleted poll');
        $I->sendGet('/polls/as46hg/responses');
        $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
        $I->seeResponseIsJson();
    }

    public function returns404EndedPollTest(\ApiTester $I)
    {
        $this->polls[] = $this->createPoll($I, [
            'identifier'     => 'hg7i3s',
            'question'       => 'Test Question Ended',
            'multipleChoice' => false,
            'passphrase'     => 'Passphrase',
            'ended'          => true,
            'deleted'        => false,
            'answers'        => [
                'Answer Passphrase 1',
                'Answer Passphrase 2'
            ]
        ]);

        $I->wantTo('Check call return 404 for ended poll');
        $I->sendGet('/polls/hg7i3s/responses');
        $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
        $I->seeResponseIsJson();
    }

    public function returnsResponsesTest(\ApiTester $I)
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
        $I->seeResponseMatchesJsonType(
            [
                'id'             => 'integer',
                'responsesCount' => 'integer'
            ],
            '$.answers[*]'
        );
    }

    public function returnsResponsesWithValues(\ApiTester $I)
    {
        $I->wantTo('Check returned responses match correct values');
        $I->sendGET('/polls/he7gis/responses');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'responsesCount' => 2,
            'userResponses'  => [],
        ]);
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getAnswers()[0]->getId(),
                'responsesCount' => 2
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getAnswers()[1]->getId(),
                'responsesCount' => 0
            ],
            '$.answers[1]'
        );
    }

    public function returnsUsersResponsesWithValues(\ApiTester $I)
    {
        $I->setCookie('USERID', '823hfso230fdjsn209');
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
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getAnswers()[0]->getId(),
                'responsesCount' => 2
            ],
            '$.answers[0]'
        );
        $I->seeResponsePathContainsJson(
            [
                'id'             => $this->polls[0]->getAnswers()[1]->getId(),
                'responsesCount' => 1
            ],
            '$.answers[1]'
        );
    }

    public function returnsErrorAnd401ForResponsesPassphraseTest(\ApiTester $I)
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

        $I->wantTo('Check call return 401');
        $I->sendGet('/polls/ic8ans/responses');
        $I->seeResponseCodeIs(HttpCode::UNAUTHORIZED);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'error' => 'string',
        ]);
        $I->seeResponseContainsJson([
            'error' => 'incorrect-passphrase'
        ]);
    }

    public function returnsResponsesWithPassphraseTest(\ApiTester $I)
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

        $I->wantTo('Check returned responses match json structure');
        $I->sendGET('/polls/he7gis/responses?passphrase=Passphrase');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'responsesCount' => 'integer',
            'answers'        => 'array',
            'userResponses'  => 'array'
        ]);
        $I->seeResponseMatchesJsonType(
            [
                'id'             => 'integer',
                'responsesCount' => 'integer'
            ],
            '$.answers[*]'
        );
    }
}
