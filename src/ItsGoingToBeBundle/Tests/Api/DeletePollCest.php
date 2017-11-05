<?php

namespace ItsGoingToBeBundle\Tests\Api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\Api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for DELETE /api/polls/:identifier
 */
class DeletePollCest extends BaseApiCest
{
    public function checkRouteTest(ApiTester $I)
    {
        $I->wantTo('Check call returns 401');
        $I->sendDelete('/polls/he7gis');
        $I->seeResponseCodeIs(HttpCode::UNAUTHORIZED);
        $I->seeResponseIsJson();
    }

    public function returns404Test(ApiTester $I)
    {
        $I->wantTo('Check call returns 404');
        $I->sendDelete('/polls/he73is', ['user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::NOT_FOUND);
        $I->seeResponseIsJson();
    }

    public function deletesPollAsAdminTest(ApiTester $I)
    {
        $I->wantTo('Returns a deleted poll');
        $I->sendDelete('/polls/he7gis', ['user' => 'admin']);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'id'             => $this->polls[0]->getId(),
            'identifier'     => 'he7gis',
            'question'       => 'Test Question 1',
            'multipleChoice' => false,
            'ended'          => false,
            'deleted'        => true,
            'responsesCount' => 2,
        ]);
    }
}
