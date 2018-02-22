<?php

namespace ItsGoingToBeBundle\Tests\Unit\Controller;

use Prophecy\Argument;
use Prophecy\ObjectProphecy;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseApiControllerTest;
use ItsGoingToBeBundle\Controller\Api\LoginApiController;
use ItsGoingToBeBundle\Entity\User;
use ItsGoingToBeBundle\Entity\LoginAttempt;

/**
 * Tests for ItsGoingToBeBundle\Controller\Api\PollApiController
 */
class LoginApiControllerTest extends BaseApiControllerTest
{
    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $controllerClass = LoginApiController::class;

    /**
     * An api url.
     *
     * @var string
     */
    protected $apiUrl = '/api/login';

    /**
     * @var ObjectProphecy
     */
    protected $encoder;

    /**
     * @var ObjectProphecy
     */
    protected $jwtEncoder;

    public function setUp()
    {
        parent::setUp();

        $this->encoder = $this->prophesize(UserPasswordEncoderInterface::class);
        $this->encoder->isPasswordValid(Argument::any(), Argument::any())->willReturn(true);
        $this->controller->setEncoder($this->encoder->reveal());

        $this->jwtEncoder = $this->prophesize(JWTEncoderInterface::class);
        $this->jwtEncoder->encode(Argument::any())->willReturn('kjdhn923982jhdnasn2398sn');
        $this->controller->setJWTEncoder($this->jwtEncoder->reveal());

        $this->controller->setTokenTTL(3600);
    }

    /**
     * Test that POST returns a 400 with errors if details not provided.
     */
    public function testLoginRequestReturns400WithNoDetails()
    {
        $request = Request::create($this->apiUrl, Request::METHOD_POST);

        $response = $this->controller->apiAction($request, 0);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(400, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertCount(2, $data['errors']);
        self::assertContains('No username has been provided', $data['errors']);
        self::assertContains('No password has been provided', $data['errors']);
    }

    /**
     * Test that POST returns a 400 with error if user doesn't exist.
     */
    public function testLoginRequestReturns400WithNoUser()
    {
        $this->userRepo->findOneBy(Argument::any())->willReturn(null);

        $requestContent = json_encode([
            'username' => 'user',
            'password' => 'password'
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 0);

        $this->userRepo->findOneBy(['username' => 'user'])
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(400, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertCount(1, $data['errors']);
        self::assertContains('Username or password incorrect', $data['errors']);
    }

    /**
     * Test that POST returns a 400 with error if user doesn't exist.
     */
    public function testLoginRequestReturns400WithBadPassword()
    {
        $this->encoder->isPasswordValid(Argument::any(), Argument::any())->willReturn(false);

        $requestContent = json_encode([
            'username' => 'user',
            'password' => 'password'
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 0);

        $this->userRepo->findOneBy(['username' => 'user'])
            ->shouldHaveBeenCalledTimes(1);
        $this->encoder->isPasswordValid(Argument::type(User::class), 'password')
            ->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(400, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertCount(1, $data['errors']);
        self::assertContains('Username or password incorrect', $data['errors']);
    }

    /**
     * Test that POST returns persits a login attempt for a successful login
     */
    public function testBadLoginRequestPersistsLoginAttemptWithPassword()
    {
        $this->encoder->isPasswordValid(Argument::any(), Argument::any())->willReturn(false);

        $requestContent = json_encode([
            'username' => 'user',
            'password' => 'password'
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $this->controller->apiAction($request, 0);

        $this->userRepo->findOneBy(['username' => 'user'])
            ->shouldHaveBeenCalledTimes(1);
        $this->encoder->isPasswordValid(Argument::type(User::class), 'password')
            ->shouldHaveBeenCalledTimes(1);

        $loginAttempt = new LoginAttempt();
        $loginAttempt->setSuccesful(false);
        $loginAttempt->setIp($request->getClientIp());
        $loginAttempt->setUsername('user');
        $loginAttempt->setPassword('password');

        $this->entityManager->persist($loginAttempt)
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that POST returns a 200 for succesful login with user and token.
     */
    public function testLoginRequestReturns200()
    {
        $this->user->extract()->willReturn([
            'id'       => 1,
            'username' => 'user'
        ]);

        $requestContent = json_encode([
            'username' => 'user',
            'password' => 'password'
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $response = $this->controller->apiAction($request, 0);

        $this->userRepo->findOneBy(['username' => 'user'])
            ->shouldHaveBeenCalledTimes(1);
        $this->encoder->isPasswordValid(Argument::type(User::class), 'password')
            ->shouldHaveBeenCalledTimes(1);

        $now = new \DateTime();
        $now->add(new \DateInterval('PT3600S'));

        $this->jwtEncoder->encode([
            'username' => 'user',
            'exp'      => $now->format('U')
        ])->shouldHaveBeenCalledTimes(1);

        self::assertInstanceOf(JsonResponse::class, $response);
        self::assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        self::assertEquals([
            'id'       => 1,
            'username' => 'user',
            'token'    => 'kjdhn923982jhdnasn2398sn'
        ], $data);
    }

    /**
     * Test that POST returns persits a login attempt for a successful login.
     */
    public function testsuccessfulLoginRequestPersistsLoginAttempt()
    {
        $this->user->extract()->willReturn([
            'id'       => 1,
            'username' => 'user'
        ]);

        $requestContent = json_encode([
            'username' => 'user',
            'password' => 'password'
        ]);
        $request = Request::create($this->apiUrl, Request::METHOD_POST, [], [], [], [], $requestContent);

        $this->controller->apiAction($request, 0);

        $this->userRepo->findOneBy(['username' => 'user'])
            ->shouldHaveBeenCalledTimes(1);
        $this->encoder->isPasswordValid(Argument::type(User::class), 'password')
            ->shouldHaveBeenCalledTimes(1);

        $loginAttempt = new LoginAttempt();
        $loginAttempt->setSuccesful(true);
        $loginAttempt->setIp($request->getClientIp());
        $loginAttempt->setUsername('user');

        $this->entityManager->persist($loginAttempt)
            ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
            ->shouldHaveBeenCalledTimes(1);
    }
}
