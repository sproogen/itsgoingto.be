<?php

namespace ItsGoingToBeBundle\Tests\Controller;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\QueryBuilder;
use Prophecy\Argument;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use ItsGoingToBeBundle\Tests\AbstractTests\BaseTest;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Service\IdentifierService;

/**
 * Tests for ItsGoingToBeBundle\Controller\ApiController
 */
class ApiControllerTest extends BaseTest
{
    /**
     * An instance of the controller being tested.
     *
     * @var ApiController
     */
    protected $controller;

    /**
     * Method called before each test is run.
     *
     * @throws \Exception if $this->controllerClass is not set.
     * @throws \Exception if $this->ControllerClass is not the name of a class implementing the RestController
     *   interface.
     */
    public function setUp()
    {
        parent::setUp();

        $this->answer = $this->prophesize(Answer::class);
        $this->answer->getId()->willReturn(5);
        $this->answer->getResponses()->willReturn([new UserResponse()]);
        $this->answer->extract()->willReturn([
            'id'             => 5,
            'answer'         => 'Answer A',
            'question'       => [
                'type' => 'question',
                'id'   => 2
            ],
            'responsesCount' => 1,
        ]);

        $this->question = $this->prophesize(Question::class);
        $this->question->getId()->willReturn(2);
        $this->question->isMultipleChoice()->willReturn(false);
        $this->question->extract()->willReturn([
            'id'             => 2,
            'identifier'     => 'lkjas79h',
            'question'       => 'Question text?',
            'answers'        => [],
            'responsesCount' => 2,
            'multipleChoice' => false,
            'deleted'        => false,
        ]);
        $this->question->getResponses()->willReturn([new UserResponse(), new UserResponse()]);
        $this->question->getAnswers()->willReturn([$this->answer->reveal(), $this->answer->reveal()]);
        $this->question->setDeleted(Argument::any())->willReturn($this->question->reveal());

        //Maybe look at using this - https://github.com/michaelmoussa/doctrine-qbmocker

        $this->answerRepository = $this->prophesize(EntityRepository::class);
        $this->answerRepository->findOneBy(Argument::any())->willReturn($this->answer->reveal());

        $this->userResponseRepository = $this->prophesize(EntityRepository::class);
        $this->userResponseRepository->findOneBy(Argument::any())->willReturn(null);
        $this->userResponseRepository->findBy(Argument::any())->willReturn(null);

        $this->questionRepository = $this->prophesize(EntityRepository::class);
        $this->questionRepository->findOneBy(Argument::any())->willReturn($this->question->reveal());

        $this->queryBuilder = $this->prophesize(QueryBuilder::class);
        $this->queryBuilder->where(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->andWhere(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->select(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->setFirstResult(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->setMaxResults(Argument::any())->willReturn($this->queryBuilder->reveal());

        $this->query = $this->prophesize(AbstractQuery::class);
        $this->query->getResult()->willReturn([$this->question->reveal()]);
        $this->queryBuilder->getQuery(Argument::any())->willReturn($this->query->reveal());
        $this->questionRepository->createQueryBuilder(Argument::any())->willReturn($this->queryBuilder->reveal());

        $this->entityManager = $this->prophesize(EntityManager::class);
        $this->entityManager->getRepository('ItsGoingToBeBundle:Answer')
            ->willReturn($this->answerRepository->reveal());
        $this->entityManager->getRepository('ItsGoingToBeBundle:Question')
            ->willReturn($this->questionRepository->reveal());
        $this->entityManager->getRepository('ItsGoingToBeBundle:UserResponse')
            ->willReturn($this->userResponseRepository->reveal());
        $this->entityManager->persist(Argument::any())
            ->willReturn(true);
        $this->entityManager->remove(Argument::any())
            ->willReturn(true);
        $this->entityManager->flush(Argument::any())
            ->willReturn(true);

        $this->authorizationChecker = $this->prophesize(AuthorizationCheckerInterface::class);
        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(false);

        $this->identifierService = $this->prophesize(IdentifierService::class);
        $this->identifierService->getCustomUserID(Argument::any())->willReturn('9873fdanba8qge9dfsaq39');
        $this->identifierService->getSessionID(Argument::any())->willReturn('12354321897467');

        $this->controller = $this->container->get('itsgoingtobe.api_controller');
        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $this->controller->setIdentifierService($this->identifierService->reveal());

        $this->client = static::$kernel->getContainer()->get('test.client');
    }

    public function tearDown()
    {
        unset($this->client);

        parent::tearDown();
    }

    /**
     * Test that if a GET request is made, a JsonResponse is returned.
     */
    public function testIndexQuestionsRequestReturnsQuestions()
    {
        $this->controller = $this->getMockBuilder('ItsGoingToBeBundle\Controller\ApiController')
            ->setMethods(array('countResults'))
            ->getMock();
        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $request = Request::create('/api/questions', 'GET');

        $this->controller
            ->expects($this->once())
            ->method('countResults')
            ->with($this->queryBuilder->reveal())
            ->will($this->returnValue(1));

        $response = $this->controller->questionsAction($request, 0);

        $this->entityManager->getRepository('ItsGoingToBeBundle:Question')
            ->shouldHaveBeenCalledTimes(1);

        $this->question->extract()
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
    public function testIndexQuestionsAppliesPagination()
    {
        $this->controller = $this->getMockBuilder('ItsGoingToBeBundle\Controller\ApiController')
            ->setMethods(array('countResults'))
            ->getMock();
        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $request = Request::create('/api/questions', 'GET');

        $response = $this->controller->questionsAction($request, 0);
        $this->queryBuilder->setFirstResult(0)
            ->shouldHaveBeenCalledTimes(1);
        $this->queryBuilder->setMaxResults(20)
            ->shouldHaveBeenCalledTimes(1);

        $request = Request::create('/api/questions?page=3&pageSize=30', 'GET');
        $response = $this->controller->questionsAction($request, 0);
        $this->queryBuilder->setFirstResult(60)
            ->shouldHaveBeenCalledTimes(1);
        $this->queryBuilder->setMaxResults(30)
            ->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that if a GET request is made with and identifier, a JsonResponse with a question is returned.
     */
    public function testRetrieveQuestionRequestReturnsQuestion()
    {
        $request = Request::create('api/questions/gf56dg', 'GET');
        $response = $this->controller->questionsAction($request, 'gf56dg');

        $this->questionRepository->findOneBy(array('identifier'=>'gf56dg', 'deleted' => false))
            ->shouldHaveBeenCalledTimes(1);

        $this->question->getAnswers()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
        self::assertEquals(2, $data['id']);
    }

    /**
     * Test that admins are able to access deleted questions
     */
    public function testRetrieveQuestionRequestReturnsDeletedQuestionForAdmin()
    {
        $request = Request::create('api/questions/gf56dg', 'GET');

        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(true);

        $response = $this->controller->questionsAction($request, 'gf56dg');

        $this->questionRepository->findOneBy(array('identifier'=>'gf56dg'))
                        ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
        self::assertEquals(2, $data['id']);
    }

    /**
     * Test that if a question can not be found a 404 is returned.
     */
    public function testRetrieveQuestionRequestReturns404()
    {
        $this->questionRepository->findOneBy(Argument::any())->willReturn(null);
        $request = Request::create('api/questions/gf56dg', 'GET');

        $response = $this->controller->questionsAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(404, $response->getStatusCode());
    }

    /**
     * Test that if a POST request is made without params an error is thrown
     */
    public function testPostQuestionRequestReturnsErrors()
    {
        $request = Request::create('/api/questions', 'POST');
        $response = $this->controller->questionsAction($request, 0);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(400, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertCount(2, $data['errors']);
        self::assertContains('No question has been provided', $data['errors']);
        self::assertContains('No answers have been provided', $data['errors']);
    }

    /**
     * Test that if a POST request is made a question is persisted
     */
    public function testPostQuestionRequestPersistsEntity()
    {
        $requestContent = json_encode([
            'question' => 'This is just a question?',
            'answers' => [
                'Answer A',
                'Answer B'
            ],
            'multipleChoice' => true,
        ]);
        $this->questionRepository->findOneBy(Argument::any())->willReturn(null);
        $request = Request::create('/api/questions', 'POST', [], [], [], [], $requestContent);

        $response = $this->controller->questionsAction($request, 0);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $this->questionRepository->findOneBy(Argument::any())
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->persist(Argument::type(Question::class))
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
        self::assertArrayHasKey('identifier', $data);
        self::assertArrayHasKey('question', $data);
        self::assertArrayHasKey('answers', $data);
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('multipleChoice', $data);
        self::assertArrayHasKey('deleted', $data);

        self::assertInternalType('string', $data['identifier']);
        self::assertEquals(8, strlen($data['identifier']));

        self::assertEquals('This is just a question?', $data['question']);
        self::assertEquals(true, $data['multipleChoice']);
        self::assertEquals(false, $data['deleted']);

        self::assertCount(2, $data['answers']);
        self::assertArrayHasKey('id', $data['answers'][0]);
        self::assertArrayHasKey('answer', $data['answers'][0]);
        self::assertEquals('Answer A', $data['answers'][0]['answer']);
        self::assertArrayHasKey('id', $data['answers'][1]);
        self::assertArrayHasKey('answer', $data['answers'][1]);
        self::assertEquals('Answer B', $data['answers'][1]['answer']);
        self::assertEquals(0, $data['responsesCount']);
    }

    /**
     * Test that DELETE returns a 401 if not admin.
     */
    public function testDeleteQuestionRequestReturns401()
    {
        $request = Request::create('/api/questions/gf56dg', 'DELETE');

        $response = $this->controller->questionsAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(401, $response->getStatusCode());
    }

    /**
     * Test that DELETE updates the deleted field.
     */
    public function testDeleteQuestionRequestSetsDeleted()
    {
        $request = Request::create('/api/questions/gf56dg', 'DELETE');

        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(true);

        $response = $this->controller->questionsAction($request, 'gf56dg');

        $this->question->setDeleted(true)
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->persist($this->question->reveal())
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);
        $this->question->extract()
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
    }

    /**
     * Test that if an OPTIONS request is made, a Response is returned.
     */
    public function testQuestionOptionsRequestReturnsResponse()
    {
        $request = Request::create('/api/questions', 'OPTIONS');

        $response = $this->controller->questionsAction($request, 0);

        $this->assertEquals(
            new Response(),
            $response
        );
    }

    /**
     * Test that if a request with an unsupported method is made, a HTTP Exception is thrown.
     */
    public function testQuestionHeadRequestReturnsHttpException()
    {
        $request = Request::create('/api/questions', 'HEAD');

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Method not allowed.');

        $this->controller->questionsAction($request, 0);
    }

    /**
     * Test that if a question can not be found a 404 is returned.
     */
    public function testIndexResponsesRequestReturns404()
    {
        $this->questionRepository->findOneBy(Argument::any())->willReturn(null);
        $request = Request::create('api/questions/gf56dg/responses', 'GET');

        $response = $this->controller->responsesAction($request, 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(404, $response->getStatusCode());
    }

    /**
     * Test that if a GET request is made, a JsonResponse is returned.
     */
    public function testIndexResponsesRequestReturnsResponses()
    {
        $request = Request::create('/api/questions/gf56dg/responses', 'GET');

        $response = $this->controller->responsesAction($request, 'gf56dg');

        $this->entityManager->getRepository('ItsGoingToBeBundle:Question')
            ->shouldHaveBeenCalledTimes(1);
        $this->questionRepository->findOneBy(array('identifier'=>'gf56dg', 'deleted'=>false))
                        ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('answers', $data);

        self::assertEquals(2, $data['responsesCount']);
        self::assertCount(2, $data['answers']);

        self::assertArrayHasKey('id', $data['answers'][0]);
        self::assertArrayHasKey('responsesCount', $data['answers'][0]);
        self::assertEquals(5, $data['answers'][0]['id']);
        self::assertEquals(1, $data['answers'][0]['responsesCount']);
    }

    /**
     * Test that if a POST request is made without params an error is thrown
     */
    public function testPostResponsesRequestReturnsErrors()
    {
        $request = Request::create('/api/questions/gf56dg/responses', 'POST');
        $response = $this->controller->responsesAction($request, 'gf56dg');

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
        $request = Request::create('/api/questions/gf56dg/responses', 'POST', [], [], [], [], $requestContent);

        $response = $this->controller->responsesAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 5, 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepository->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepository->findOneBy(array('userSessionID' => '12354321897467', 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);

        $userResponse = new UserResponse();
        $userResponse->setQuestion($this->question->reveal());
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
        $request = Request::create('/api/questions/gf56dg/responses', 'POST', [], [], [], [], $requestContent);

        $response = $this->controller->responsesAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 5, 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->answerRepository->findOneBy(array('id' => 6, 'question' => 2))
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
        $this->userResponseRepository->findOneBy(Argument::any())->willReturn($userResponse->reveal());

        $this->answer->getId()->willReturn(6);

        $requestContent = json_encode([
            'answers' => 6
        ]);
        $request = Request::create('/api/questions/gf56dg/responses', 'POST', [], [], [], [], $requestContent);

        $response = $this->controller->responsesAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 6, 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepository->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepository->findOneBy(array('userSessionID' => '12354321897467', 'question' => 2))
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
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('answers', $data);
    }

    /**
     * Test that if a POST request is made a UserResponse is persisted
     */
    public function testPostResponsesRequestPersistsMultipleEntities()
    {
        $this->question->isMultipleChoice()->willReturn(true);
        $answer2 = $this->prophesize(Answer::class);
        $answer2->getId()->willReturn(6);
        $answer3 = $this->prophesize(Answer::class);
        $answer3->getId()->willReturn(7);
        $userResponse2 = $this->prophesize(UserResponse::class);
        $userResponse2->getAnswer()->willReturn($answer2->reveal());
        $userResponse3 = $this->prophesize(UserResponse::class);
        $userResponse3->getAnswer()->willReturn($answer3->reveal());
        $this->answerRepository->findOneBy(array('id' => 6, 'question' => 2))->willReturn($answer2->reveal());

        $this->userResponseRepository->findBy(array('userSessionID' => '12354321897467', 'question' => 2))
            ->willReturn([$userResponse2->reveal(), $userResponse3->reveal()]);

        $requestContent = json_encode([
            'answers' => [5, 6]
        ]);
        $request = Request::create('/api/questions/gf56dg/responses', 'POST', [], [], [], [], $requestContent);

        $response = $this->controller->responsesAction($request, 'gf56dg');

        $this->answerRepository->findOneBy(array('id' => 5, 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->answerRepository->findOneBy(array('id' => 6, 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);

        $this->entityManager->remove($userResponse3->reveal())
            ->shouldHaveBeenCalledTimes(1);

        $this->userResponseRepository->findBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepository->findBy(array('userSessionID' => '12354321897467', 'question' => 2))
            ->shouldHaveBeenCalledTimes(1);

        $this->userResponseRepository
            ->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'question' => 2, 'answer' => 5))
            ->shouldHaveBeenCalledTimes(1);
        $this->userResponseRepository
            ->findOneBy(array('customUserID' => '9873fdanba8qge9dfsaq39', 'question' => 2, 'answer' => 6))
            ->shouldHaveBeenCalledTimes(1);

        $userResponse = new UserResponse();
        $userResponse->setQuestion($this->question->reveal());
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
        self::assertArrayHasKey('responsesCount', $data);
        self::assertArrayHasKey('answers', $data);
    }

    /**
     * Test that if an OPTIONS request is made, a Response is returned.
     */
    public function testResponsesOptionsRequestReturnsResponse()
    {
        $request = Request::create('/api/questions/gf56dg/responses', 'OPTIONS');

        $response = $this->controller->responsesAction($request, 'gf56dg');

        $this->assertEquals(
            new Response(),
            $response
        );
    }

    /**
     * Test that if a request with an unsupported method is made, a HTTP Exception is thrown.
     */
    public function testResponsesHeadRequestReturnsHttpException()
    {
        $request = Request::create('/api/questions/gf56dg/responses', 'HEAD');

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Method not allowed.');

        $this->controller->responsesAction($request, 'gf56dg');
    }
}
