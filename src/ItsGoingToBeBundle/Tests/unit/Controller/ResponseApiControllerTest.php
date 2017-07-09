<?php

namespace ItsGoingToBeBundle\Tests\Unit\Controller;

use Prophecy\Argument;
use Prophecy\ObjectProphecy;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseApiControllerTest;
use ItsGoingToBeBundle\Controller\Api\ResponseApiController;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Tests for ItsGoingToBeBundle\Controller\Api\ResponseApiController
 */
class ResponseApiControllerTest extends BaseApiControllerTest
{
    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $controllerClass = ResponseApiController::class;

    /**
     * An api url.
     *
     * @var string
     */
    protected $apiUrl = 'api/polls/gf56dg/responses';

    /**
     * Method called before each test is run.
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Test that if a poll can not be found a 404 is returned.
     */
    public function testIndexResponsesRequestReturns404()
    {
        $this->pollRepository->findOneBy(Argument::any())->willReturn(null);
        $request = Request::create($this->apiUrl, Request::METHOD_GET);

        $response = $this->controller->apiAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(404, $response->getStatusCode());
    }

    /**
     * Test that if a GET request is made, a JsonResponse is returned.
     */
    public function testIndexResponsesRequestReturnsResponses()
    {
        $request  = Request::create($this->apiUrl, Request::METHOD_GET);
        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->entityManager->getRepository(Poll::class)
             ->shouldHaveBeenCalledTimes(1);
        $this->pollRepository->findOneBy(array('identifier'=>'gf56dg', 'deleted'=>false))
                             ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('userResponses', $data);
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('answers', $data);

        self::assertEquals([], $data['userResponses']);
        self::assertEquals(2, $data['responsesCount']);
        self::assertCount(2, $data['answers']);

        self::assertArrayHasKey('id', $data['answers'][0]);
        self::assertArrayHasKey('responsesCount', $data['answers'][0]);
        self::assertEquals(5, $data['answers'][0]['id']);
        self::assertEquals(1, $data['answers'][0]['responsesCount']);
    }

    /**
     * Test that the users responses is returned with the poll
     */
    public function testIndexResponsesRequestReturnsUserResponses()
    {
        $request = Request::create($this->apiUrl, Request::METHOD_GET);

        $this->userResponse = $this->prophesize(userResponse::class);
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
     * Test that if a POST request is made without params an error is thrown
     */
    public function testPostResponsesRequestReturnsErrors()
    {
        $request = Request::create($this->apiUrl, Request::METHOD_POST);
        $response = $this->controller->apiAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(400, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertCount(1, $data['errors']);
        self::assertContains('No answers have been provided', $data['errors']);
    }

    /**
     * Test that if a POST request is made a UserResponse is persisted
     */
    public function testPostResponsesRequestPersistsEntity()
    {
        $requestContent = json_encode([
            'answers' => 5
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 5, 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepo->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepo->findOneBy(array('userSessionID' => '12354321897467', 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);

        $userResponse = new UserResponse();
        $userResponse->setPoll($this->poll->reveal());
        $userResponse->setAnswer($this->answer->reveal());
        $userResponse->setCustomUserID('9873fdanba8qge9dfsaq39');
        $userResponse->setUserSessionID('12354321897467');
        $userResponse->setUserIP($request->server->get('REMOTE_ADDR'));
        $this->entityManager->persist($userResponse)
            ->shouldHaveBeenCalledTimes(1);

        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('userResponses', $data);
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('answers', $data);
    }

    /**
     * Test that if a POST request is made a UserResponse is persisted
     */
    public function testPostResponsesRequestPersists1Entity()
    {
        $requestContent = json_encode([
            'answers' => [5,6]
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 5, 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->answerRepository->findOneBy(array('id' => 6, 'poll' => 2))
            ->shouldHaveBeenCalledTimes(0);

        $this->entityManager->persist(Argument::type(UserResponse::class))
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());
    }

    /**
     * Test that if a POST request is made a UserResponse is updated
     */
    public function testPostResponsesRequestUpdatesEntity()
    {
        $userResponse = $this->prophesize(UserResponse::class);
        $this->userResponseRepo->findOneBy(Argument::any())->willReturn($userResponse->reveal());

        $this->answer->getId()->willReturn(6);

        $requestContent = json_encode([
            'answers' => 6
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 6, 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepo->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepo->findOneBy(array('userSessionID' => '12354321897467', 'poll' => 2))
            ->shouldHaveBeenCalledTimes(0);

        $userResponse->setAnswer($this->answer->reveal())
            ->shouldHaveBeenCalledTimes(1);

        $this->entityManager->persist($userResponse->reveal())
            ->shouldHaveBeenCalledTimes(1);

        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('userResponses', $data);
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('answers', $data);
    }

    /**
     * Test that if a POST request is made a UserResponse is persisted
     */
    public function testPostResponsesRequestPersistsMultipleEntities()
    {
        $this->poll->isMultipleChoice()->willReturn(true);
        $answer2 = $this->prophesize(Answer::class);
        $answer2->getId()->willReturn(6);
        $answer2->addResponse(Argument::any())->willReturn(null);
        $answer3 = $this->prophesize(Answer::class);
        $answer3->getId()->willReturn(7);
        $answer3->addResponse(Argument::any())->willReturn(null);
        $userResponse2 = $this->prophesize(UserResponse::class);
        $userResponse2->getAnswer()->willReturn($answer2->reveal());
        $userResponse3 = $this->prophesize(UserResponse::class);
        $userResponse3->getAnswer()->willReturn($answer3->reveal());
        $this->answerRepository->findOneBy(array('id' => 6, 'poll' => 2))->willReturn($answer2->reveal());

        $this->userResponseRepo->findBy(array('userSessionID' => '12354321897467', 'poll' => 2))
            ->willReturn([$userResponse2->reveal(), $userResponse3->reveal()]);

        $requestContent = json_encode([
            'answers' => [5, 6]
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 5, 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->answerRepository->findOneBy(array('id' => 6, 'poll' => 2))
            ->shouldHaveBeenCalledTimes(1);

        $this->entityManager->remove($userResponse3->reveal())
            ->shouldHaveBeenCalledTimes(1);

        $this->userResponseRepo->findBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'poll' => 2))
            ->shouldHaveBeenCalledTimes(2);
        $this->userResponseRepo->findBy(array('userSessionID' => '12354321897467', 'poll' => 2))
            ->shouldHaveBeenCalledTimes(2);

        $this->userResponseRepo
            ->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'poll' => 2, 'answer' => 5))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepo
            ->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'poll' => 2, 'answer' => 6))
            ->shouldHaveBeenCalledTimes(1);

        $userResponse = new UserResponse();
        $userResponse->setPoll($this->poll->reveal());
        $userResponse->setAnswer($this->answer->reveal());
        $userResponse->setCustomUserID('9873fdanba8qge9dfsaq39');
        $userResponse->setUserSessionID('12354321897467');
        $userResponse->setUserIP($request->server->get('REMOTE_ADDR'));
        $this->entityManager->persist($userResponse)
            ->shouldHaveBeenCalledTimes(1);

        $userResponse->setAnswer($answer2->reveal());
        $this->entityManager->persist($userResponse)
            ->shouldHaveBeenCalledTimes(1);

        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(2);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('userResponses', $data);
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('answers', $data);
    }
}
