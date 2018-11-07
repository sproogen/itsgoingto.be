<?php

namespace App\Tests\Unit\Controller;

use Prophecy\Argument;
use Prophecy\ObjectProphecy;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Tests\Unit\AbstractTests\BaseApiControllerTest;
use App\Controller\Api\StatsApiController;
use App\Entity\Poll;
use App\Entity\UserResponse;

/**
 * Tests for App\Controller\Api\StatsApiControllerTest
 */
class StatsApiControllerTest extends BaseApiControllerTest
{
    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $controllerClass = StatsApiController::class;

    /**
     * An api url.
     *
     * @var string
     */
    protected $apiUrl = '/api/stats';

    /**
     * Test that GET returns a 401 if not admin.
     */
    public function testGetStatsRequestReturns401()
    {
        $request = Request::create($this->apiUrl, Request::METHOD_GET);

        $response = $this->controller->apiAction($request, 0);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(401, $response->getStatusCode());
    }

    /**
     * Test that if a GET request is made, a JsonResponse is returned.
     */
    public function testGetStatsRequestReturnsStatsForAdmin()
    {
        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(true);
        $this->controller = $this->getMockBuilder(StatsApiController::class)
            ->setConstructorArgs(array(
                $this->entityManager->reveal(),
                $this->authorizationChecker->reveal(),
                $this->identifierService->reveal(),
                $this->pollEndService->reveal(),
                ''
            ))
            ->setMethods(array('countResults'))
            ->getMock();

        $request = Request::create($this->apiUrl, Request::METHOD_GET);

        $this->controller
            ->expects($this->exactly(2))
            ->method('countResults')
            ->with($this->queryBuilder->reveal())
            ->willReturnOnConsecutiveCalls($this->returnValue(106), $this->returnValue(229));

        $response = $this->controller->apiAction($request, 0);

        $this->entityManager->getRepository(Poll::class)
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->getRepository(UserResponse::class)
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('polls', $data);
        self::assertArrayHasKey('responses', $data);
        self::assertEquals(106, $data['polls']);
        self::assertEquals(229, $data['responses']);
    }
}
