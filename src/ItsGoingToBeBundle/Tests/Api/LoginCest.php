<?php

namespace ItsGoingToBeBundle\Tests\Api;

use Codeception\Util\HttpCode;
use ItsGoingToBeBundle\Tests\Api\BaseApiCest;
use ItsGoingToBeBundle\ApiTester;

/**
 * API Tests for POST /api/login
 */
class LoginCest extends BaseApiCest
{
    public function checkRouteTest(ApiTester $I)
    {
        $I->wantTo('Check call return 400');
        $I->sendPOST('/login');
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
    }

    public function returnsErrorMessagesAnd400Test(ApiTester $I)
    {
        $I->wantTo('Check call returns errors');
        $I->sendPOST('/login');
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'errors' => 'array',
        ]);
        $I->seeResponseContainsJson([
            'errors' => [
                'No username has been provided',
                'No password has been provided'
            ]
        ]);
    }

    public function returns400IfUserDoesntExist(ApiTester $I)
    {
        $I->wantTo('Check call returns logged in user');
        $I->sendPOST('/login', [
            'username' => 'admin',
            'password' => '$2y$12$SmJomfmyLDtfLT9HI.z.qunIMsYI50gG2h8kVFw3BVaHyUn3cmCy.'
        ]);
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'errors' => 'array',
        ]);
        $I->seeResponseContainsJson([
            'errors' => [
                'Username or password incorrect'
            ]
        ]);
    }

    public function returns400IfPasswordDoesntMatch(ApiTester $I)
    {
        $this->createUser($I, [
            'username' => 'admin',
            'password' => '$2y$12$SmJomfmyLDtfLT9HI.z.qunIMsYI50gG2h8kVFw3BVaHyUn3cmCy.'
        ]);

        $I->wantTo('Check call returns logged in user');
        $I->sendPOST('/login', [
            'username' => 'admin',
            'password' => 'password789'
        ]);
        $I->seeResponseCodeIs(HttpCode::BAD_REQUEST);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'errors' => 'array',
        ]);
        $I->seeResponseContainsJson([
            'errors' => [
                'Username or password incorrect'
            ]
        ]);
    }

    public function logsInAndReturnsUserTest(ApiTester $I)
    {
        $this->createUser($I, [
            'username' => 'admin',
            'password' => '$2y$12$SmJomfmyLDtfLT9HI.z.qunIMsYI50gG2h8kVFw3BVaHyUn3cmCy.'
        ]);

        $I->wantTo('Check call returns logged in user');
        $I->sendPOST('/login', [
            'username' => 'admin',
            'password' => 'password123'
        ]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseMatchesJsonType([
            'id'             => 'integer',
            'username'       => 'string',
            'token'          => 'string'
        ]);
    }
}
