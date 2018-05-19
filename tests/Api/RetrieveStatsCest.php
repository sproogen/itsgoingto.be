<?php

namespace App\Tests\Api;

use Codeception\Util\HttpCode;
use App\Tests\Api\BaseApiCest;

/**
 * API Tests for GET /api/stats
 */
class RetrieveStatsCest extends BaseApiCest
{
    public function checkRouteTest(\ApiTester $I)
    {
        $user = $this->createUser($I, [
            'username' => 'admin',
            'password' => 'password123'
        ]);
        $token = $this->getTokenForUser($I, $user);
        $I->amBearerAuthenticated($token);

        $I->wantTo('Check call return 200 and matches json structure');
        $I->sendGET('/stats');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
    }

    public function returns401ForUnauthorizedUser(\ApiTester $I)
    {
        $I->wantTo('Check call returns 401');
        $I->sendDelete('/stats');
        $I->seeResponseCodeIs(HttpCode::UNAUTHORIZED);
        $I->seeResponseIsJson();
    }

    public function returnsStatsTest(\ApiTester $I)
    {
        $user = $this->createUser($I, [
            'username' => 'admin',
            'password' => 'password123'
        ]);
        $token = $this->getTokenForUser($I, $user);
        $I->amBearerAuthenticated($token);

        $I->wantTo('Check returned stats match json structure');
        $I->sendGET('/stats');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
         $I->seeResponseMatchesJsonType([
            'polls'     => 'integer',
            'responses' => 'integer'
        ]);
    }

    public function returnsStatsWithValuesTest(\ApiTester $I)
    {
        $user = $this->createUser($I, [
            'username' => 'admin',
            'password' => 'password123'
        ]);
        $token = $this->getTokenForUser($I, $user);
        $I->amBearerAuthenticated($token);

        $I->wantTo('Check returned stats match correct values');
        $I->sendGET('/stats');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'polls'     => 2,
            'responses' => 2
        ]);
    }
}
