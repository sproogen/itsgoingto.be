<?php

namespace ItsGoingToBeBundle\Tests\Unit\AbstractTests;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\AbstractQuery;
use Prophecy\ObjectProphecy;
use Prophecy\Argument;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ItsGoingToBeBundle\Interfaces\ApiControllerInterface;
use ItsGoingToBeBundle\Controller\Api\PollApiController;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseTest;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Service\IdentifierService;

abstract class BaseApiControllerTest extends BaseTest
{
    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $controllerClass;

    /**
     * An instance of the controller being tested.
     *
     * @var ApiControllerInterface
     */
    protected $controller;

    /**
     * An api url.
     *
     * @var string
     */
    protected $apiUrl;

    /**
     * @var ObjectProphecy
     */
    protected $answer;

    /**
     * @var ObjectProphecy
     */
    protected $poll;

    /**
     * @var ObjectProphecy
     */
    protected $answerRepository;

    /**
     * @var ObjectProphecy
     */
    protected $userResponseRepo;

    /**
     * @var ObjectProphecy
     */
    protected $pollRepository;

    /**
     * @var ObjectProphecy
     */
    protected $queryBuilder;

    /**
     * @var ObjectProphecy
     */
    protected $query;

    /**
     * @var ObjectProphecy
     */
    protected $authorizationChecker;

    /**
     * @var ObjectProphecy
     */
    protected $identifierService;

    /**
     * Test setup.
     *
     * @throws \Exception if $this->controllerClass is not set.
     * @throws \Exception if $this->ControllerClass is not the name of a class implementing the ApiControllerInterface
     */
    public function setUp()
    {
        parent::setUp();

        if (!$this->controllerClass) {
            $message = 'Classes extending '
                       . BaseApiControllerTest::class
                       . ' must declare a value for $controllerClass.';
            throw new \Exception($message);
        }

        $this->controller = new $this->controllerClass();
        if (!$this->controller instanceof ApiControllerInterface) {
            $message = '$controllerClass must represent a class implementing the '
                       . ApiControllerInterface::class
                       . ' interface.';
            throw new \Exception($message);
        }

        // Maybe look at using this - https://github.com/michaelmoussa/doctrine-qbmocker

        $this->answer = $this->prophesize(Answer::class);
        $this->answer->getId()->willReturn(5);
        $this->answer->getResponses()->willReturn([new UserResponse()]);
        $this->answer->extract()->willReturn([
            'id'             => 5,
            'answer'         => 'Answer A',
            'poll'           => [
                'type' => 'poll',
                'id'   => 2
            ],
            'responsesCount' => 1,
        ]);

        $this->poll = $this->prophesize(Poll::class);
        $this->poll->getId()->willReturn(2);
        $this->poll->isMultipleChoice()->willReturn(false);
        $this->poll->extract()->willReturn([
            'id'             => 2,
            'identifier'     => 'lkjas79h',
            'question'       => 'Question text?',
            'answers'        => [],
            'responsesCount' => 2,
            'multipleChoice' => false,
            'deleted'        => false,
        ]);
        $this->poll->getResponses()->willReturn([new UserResponse(), new UserResponse()]);
        $this->poll->getAnswers()->willReturn([$this->answer->reveal(), $this->answer->reveal()]);
        $this->poll->setDeleted(Argument::any())->willReturn($this->poll->reveal());

        $this->answerRepository = $this->prophesize(EntityRepository::class);
        $this->answerRepository->findOneBy(Argument::any())->willReturn($this->answer->reveal());

        $this->userResponseRepo = $this->prophesize(EntityRepository::class);
        $this->userResponseRepo->findOneBy(Argument::any())->willReturn(null);
        $this->userResponseRepo->findBy(Argument::any())->willReturn(null);

        $this->pollRepository = $this->prophesize(EntityRepository::class);
        $this->pollRepository->findOneBy(Argument::any())->willReturn($this->poll->reveal());

        $this->queryBuilder = $this->prophesize(QueryBuilder::class);
        $this->queryBuilder->where(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->andWhere(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->select(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->setFirstResult(Argument::any())->willReturn($this->queryBuilder->reveal());
        $this->queryBuilder->setMaxResults(Argument::any())->willReturn($this->queryBuilder->reveal());

        $this->query = $this->prophesize(AbstractQuery::class);
        $this->query->getResult()->willReturn([$this->poll->reveal()]);
        $this->queryBuilder->getQuery(Argument::any())->willReturn($this->query->reveal());
        $this->pollRepository->createQueryBuilder(Argument::any())->willReturn($this->queryBuilder->reveal());

        $this->entityManager = $this->prophesize(EntityManager::class);
        $this->entityManager->getRepository(Answer::class)
            ->willReturn($this->answerRepository->reveal());
        $this->entityManager->getRepository(Poll::class)
            ->willReturn($this->pollRepository->reveal());
        $this->entityManager->getRepository(UserResponse::class)
            ->willReturn($this->userResponseRepo->reveal());
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

        $this->controller->setEntityManager($this->entityManager->reveal());
        $this->controller->setAuthorizationChecker($this->authorizationChecker->reveal());
        $this->controller->setIdentifierService($this->identifierService->reveal());
    }

    /**
     * Test tear down.
     */
    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Test that if an OPTIONS request is made, a Response is returned.
     */
    public function testAPIOptionsRequestReturnsResponse()
    {
        $request = Request::create($this->apiUrl, Request::METHOD_OPTIONS);

        $response = $this->controller->apiAction($request, 0);

        $this->assertEquals(
            new Response(),
            $response
        );
    }

    /**
     * Test that if a request with an unsupported method is made, a HTTP Exception is thrown.
     */
    public function testApiHeadRequestReturnsHttpException()
    {
        $request = Request::create($this->apiUrl, Request::METHOD_HEAD);

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('Method not allowed.');

        $this->controller->apiAction($request, 0);
    }
}
