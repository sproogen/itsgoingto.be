<?php

namespace ItsGoingToBeBundle\Tests\Controller;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\QueryBuilder;
use Prophecy\Argument;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use ItsGoingToBeBundle\Tests\AbstractTests\BaseTest;
use ItsGoingToBeBundle\Entity\Question;

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

        $this->question = $this->prophesize(Question::class);
        $this->question->extract()->willReturn([
            'id'             => 2,
            'identifier'     => 'lkjas79h',
            'question'       => 'Question text?',
            'answers'        => [],
            'responses'      => [],
            'multipleChoice' => false,
            'deleted'        => false,
        ]);
        $this->question->getAnswers()->willReturn([]);

        //Maybe look at using this - https://github.com/michaelmoussa/doctrine-qbmocker

        $this->entityManager = $this->prophesize(EntityManager::class);
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

        $this->entityManager->getRepository('ItsGoingToBeBundle:Question')
            ->willReturn($this->questionRepository->reveal());

        $this->authorizationChecker = $this->prophesize(AuthorizationCheckerInterface::class);
        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(false);

        $this->controller = $this->container->get('itsgoingtobe.api_controller');
        $this->controller->setEntityManager($this->entityManager->reveal());

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
    public function testIndexRequestReturnsJson()
    {
        $this->controller = $this->getMockBuilder('ItsGoingToBeBundle\Controller\ApiController')
            ->setMethods(array('countResults'))
            ->getMock();
        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $this->client->request('GET', 'api/questions');

        $this->controller
            ->expects($this->once())
            ->method('countResults')
            ->with($this->queryBuilder->reveal())
            ->will($this->returnValue(1));

        $response = $this->controller->questionsAction($this->client->getRequest(), 0);

        $this->entityManager->getRepository('ItsGoingToBeBundle:Question')
            ->shouldHaveBeenCalledTimes(2);

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
    public function testIndexAppliesPagination()
    {
        $this->controller = $this->getMockBuilder('ItsGoingToBeBundle\Controller\ApiController')
            ->setMethods(array('countResults'))
            ->getMock();
        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $this->client->request('GET', 'api/questions');

        $response = $this->controller->questionsAction($this->client->getRequest(), 0);
        $this->queryBuilder->setFirstResult(0)
            ->shouldHaveBeenCalledTimes(1);
        $this->queryBuilder->setMaxResults(20)
            ->shouldHaveBeenCalledTimes(1);

        $this->client->request('GET', 'api/questions?page=3&pageSize=30');
        $response = $this->controller->questionsAction($this->client->getRequest(), 0);
        $this->queryBuilder->setFirstResult(60)
            ->shouldHaveBeenCalledTimes(1);
        $this->queryBuilder->setMaxResults(30)
            ->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that if a GET request is made with and identifier, a JsonResponse with a question is returned.
     */
    public function testRetrieveRequestReturnsQuestion()
    {
        $this->client->request('GET', 'api/questions/gf56dg');

        $response = $this->controller->questionsAction($this->client->getRequest(), 'gf56dg');

        $this->questionRepository->findOneBy(array('identifier'=>'gf56dg', 'deleted' => false))
            ->shouldHaveBeenCalledTimes(2);

        $this->question->getAnswers()
            ->shouldHaveBeenCalledTimes(2);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertArrayHasKey('id', $data);
        self::assertEquals(2, $data['id']);
    }

    /**
     * Test that admins are able to access deleted questions
     */
    public function testRetrieveRequestReturnsDeletedQuestionForAdmin()
    {
        $this->client->request('GET', 'api/questions/gf56dg');

        $this->authorizationChecker->isGranted('ROLE_ADMIN')->willReturn(true);
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());

        $response = $this->controller->questionsAction($this->client->getRequest(), 'gf56dg');

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
    public function testRetrieveRequestReturns404()
    {
        $this->questionRepository->findOneBy(Argument::any())->willReturn(null);
        $this->client->request('GET', 'api/questions/gf56dg');

        $response = $this->controller->questionsAction($this->client->getRequest(), 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(404, $response->getStatusCode());
    }

    /**
     * Test that if a POST request is made, a JsonResponse is returned.
     */
    public function testPostRequestReturnsJson()
    {
        $this->client->request('POST', 'api/questions/');

        $response = $this->controller->questionsAction($this->client->getRequest(), 0);

        self::assertInstanceOf(JsonResponse::class, $response);
    }

    /**
     * Test that DELETE thows an exception if not admin.
     */
    public function testDeleteRequestReturnsException()
    {
        $this->client->request('DELETE', 'api/questions/gf56dg');

        self::setExpectedException(AccessDeniedException::class);
        $response = $this->controller->questionsAction($this->client->getRequest(), 'gf56dg');

        self::assertInstanceOf(JsonResponse::class, $response);
    }

    /**
     * Test that if an OPTIONS request is made, a Response is returned.
     */
    public function testOptionsRequestReturnsResponse()
    {
        $this->client->request('OPTIONS', 'api/questions/');

        $response = $this->controller->questionsAction($this->client->getRequest(), 0);

        $this->assertEquals(
            new Response(),
            $response
        );
    }

    /**
     * Test that if a request with an unsupported method is made, a HTTP Exception is thrown.
     */
    public function testHeadRequestReturnsHttpException()
    {
        $this->client->request('HEAD', 'api/questions/');

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Method not allowed.');

        $this->controller->questionsAction($this->client->getRequest(), 0);
    }
}
