<?php

namespace ItsGoingToBeBundle\Tests\Unit\Controller;

use Prophecy\Argument;
use Prophecy\ObjectProphecy;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseApiControllerTest;
use ItsGoingToBeBundle\Controller\Api\PollApiController;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * ItsGoingToBeBundle\Controller\Api\PollApiController
 */
class PollApiControllerTest extends BaseApiControllerTest
{

    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $controllerClass = PollApiController::class;

    /**
     * An api url.
     *
     * @var string
     */
    protected $apiUrl = '/api/polls';

    /**
     * Test that if a GET request is made, a JsonResponse is returned.
     */
    public function testIndexPollRequestReturnsPolls()
    {
        $this->controller = $this->getMockBuilder(PollApiController::class)
            ->setMethods(array('countResults'))
            ->getMock();
        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $request = Request::create($this->apiUrl, Request::METHOD_GET);

        $this->controller
            ->expects($this->once())
            ->method('countResults')
            ->with($this->queryBuilder->reveal())
            ->will($this->returnValue(1));

        $response = $this->controller->apiAction($request, 0);

        $this->entityManager->getRepository(Poll::class)
            ->shouldHaveBeenCalledTimes(1);

        $this->poll->extract()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('count', $data);
        self::assertArrayHasKey('total', $data);
        self::assertArrayHasKey('entities', $data);
        self::assertEquals(1, $data['count']);
        self::assertEquals(1, $data['total']);
        self::assertCount(1, $data['entities']);
    }

    /**
     * Test that if a GET request is made, a JsonResponse is returned.
     */
    public function testIndexPollsAppliesPagination()
    {
        $this->controller = $this->getMockBuilder(PollApiController::class)
            ->setMethods(array('countResults'))
            ->getMock();
        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $request = Request::create($this->apiUrl, Request::METHOD_GET);

        $response = $this->controller->apiAction($request, 0);
        $this->queryBuilder->setFirstResult(0)
            ->shouldHaveBeenCalledTimes(1);
        $this->queryBuilder->setMaxResults(20)
            ->shouldHaveBeenCalledTimes(1);

        $request = Request::create($this->apiUrl . '?page=3&pageSize=30', Request::METHOD_GET);
        $response = $this->controller->apiAction($request, 0);
        $this->queryBuilder->setFirstResult(60)
            ->shouldHaveBeenCalledTimes(1);
        $this->queryBuilder->setMaxResults(30)
            ->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that if a GET request is made with and identifier, a JsonResponse with a poll is returned.
     */
    public function testRetrievePollRequestReturnsPoll()
    {
        $request = Request::create($this->apiUrl . '/gf56dg', Request::METHOD_GET);
        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->pollRepository->findOneBy(array('identifier'=>'gf56dg', 'deleted' => false))
            ->shouldHaveBeenCalledTimes(1);

        $this->poll->getAnswers()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
        self::assertEquals(2, $data['id']);
    }

    /**
     * Test that the users responses is returned with the poll
     */
    public function testRetrievePollRequestReturnsUserResponses()
    {
        $request = Request::create($this->apiUrl . '/gf56dg', Request::METHOD_GET);
        $response = $this->controller->apiAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('userResponses', $data);
        self::assertEquals([], $data['userResponses']);

        $this->userResponse = $this->prophesize(UserResponse::class);
        $this->userResponse->getAnswer()->willReturn($this->answer->reveal());
        $this->userResponseRepo->findBy(Argument::any())->willReturn([
            $this->userResponse->reveal(), $this->userResponse->reveal()
        ]);

        $response = $this->controller->apiAction($request, 'gf56dg');
        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('userResponses', $data);
        self::assertEquals([5, 5], $data['userResponses']);
    }

    /**
     * Test that admins are able to access deleted poll
     */
    public function testRetrievePollRequestReturnsDeletedPollForAdmin()
    {
        $request = Request::create($this->apiUrl . '/gf56dg', Request::METHOD_GET);

        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(true);

        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->pollRepository->findOneBy(array('identifier'=>'gf56dg'))
                        ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
        self::assertEquals(2, $data['id']);
    }

    /**
     * Test that if a poll can not be found a 404 is returned.
     */
    public function testRetrievePollRequestReturns404()
    {
        $this->pollRepository->findOneBy(Argument::any())->willReturn(null);
        $request = Request::create($this->apiUrl . '/gf56dg', Request::METHOD_GET);

        $response = $this->controller->apiAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(404, $response->getStatusCode());
    }

    /**
     * Test that if a POST request is made without params an error is thrown
     */
    public function testPostPollRequestReturnsErrors()
    {
        $request = Request::create($this->apiUrl, Request::METHOD_POST);
        $response = $this->controller->apiAction($request, 0);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(400, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertCount(2, $data['errors']);
        self::assertContains('No question has been provided', $data['errors']);
        self::assertContains('No answers have been provided', $data['errors']);
    }

    /**
     * Test that if a POST request is made a poll is persisted
     */
    public function testPostPollRequestPersistsEntity()
    {
        $requestContent = json_encode([
            'question' => 'This is just a question?',
            'answers' => [
                'Answer A',
                'Answer B'
            ],
            'multipleChoice' => true,
            'passphrase' => 'Passphrase'
        ]);
        $this->pollRepository->findOneBy(Argument::any())->willReturn(null);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 0);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $this->pollRepository->findOneBy(Argument::any())
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->persist(Argument::type(Poll::class))
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
        self::assertArrayHasKey('identifier', $data);
        self::assertArrayHasKey('question', $data);
        self::assertArrayHasKey('answers', $data);
        self::assertArrayHasKey('userResponses', $data);
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('multipleChoice', $data);
        self::assertArrayHasKey('passphrase', $data);
        self::assertArrayHasKey('deleted', $data);

        self::assertInternalType('string', $data['identifier']);
        self::assertEquals(8, strlen($data['identifier']));

        self::assertEquals('This is just a question?', $data['question']);
        self::assertEquals(true, $data['multipleChoice']);
        self::assertEquals('Passphrase', $data['passphrase']);
        self::assertEquals(false, $data['deleted']);

        self::assertCount(2, $data['answers']);
        self::assertArrayHasKey('id', $data['answers'][0]);
        self::assertArrayHasKey('answer', $data['answers'][0]);
        self::assertEquals('Answer A', $data['answers'][0]['answer']);
        self::assertArrayHasKey('id', $data['answers'][1]);
        self::assertArrayHasKey('answer', $data['answers'][1]);
        self::assertEquals('Answer B', $data['answers'][1]['answer']);
        self::assertEquals([], $data['userResponses']);
        self::assertEquals(0, $data['responsesCount']);
    }

    /**
     * Test that DELETE returns a 401 if not admin.
     */
    public function testDeletePollRequestReturns401()
    {
        $request = Request::create($this->apiUrl . '/gf56dg', Request::METHOD_DELETE);

        $response = $this->controller->apiAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(401, $response->getStatusCode());
    }

    /**
     * Test that DELETE updates the deleted field.
     */
    public function testDeletePollRequestSetsDeleted()
    {
        $request = Request::create($this->apiUrl . '/gf56dg', Request::METHOD_DELETE);

        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(true);

        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->poll->setDeleted(true)
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->persist($this->poll->reveal())
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);
        $this->poll->extract()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
    }
}
