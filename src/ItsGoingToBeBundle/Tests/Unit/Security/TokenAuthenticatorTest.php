<?php

namespace ItsGoingToBeBundle\Tests\Unit\Security;

use Prophecy\Argument;
use Prophecy\ObjectProphecy;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseTest;
use ItsGoingToBeBundle\Security\TokenAuthenticator;

/**
 * Tests for ItsGoingToBeBundle\Service\TokenAuthenticator
 */
class TokenAuthenticatorTest extends BaseTest
{
    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $serviceClass = TokenAuthenticator::class;

    /**
     * @var ObjectProphecy
     */
    protected $encoder;

    /**
     * @var ObjectProphecy
     */
    protected $entityManager;

    public function setUp()
    {
        parent::setUp();

        $this->jwtEncoder = $this->prophesize(JWTEncoderInterface::class);

        $this->service = new $this->serviceClass($this->jwtEncoder->reveal());
    }

    /**
     * Test that getCredentials returns null if no token found in header
     */
    public function testGetCredentialsReturnsNullIfNoToken()
    {
        self::assertEquals(
            null,
            $this->service->getCredentials(new Request())
        );
    }

    /**
     * Test that checkCredentials returns the token in the header
     */
    public function testGetCredentialsReturnsToken()
    {
        $request = new Request();
        $request->headers->set('Authorization', 'Bearer asdjasuh45asjdf02jdfsj');

        self::assertEquals(
            'asdjasuh45asjdf02jdfsj',
            $this->service->getCredentials($request)
        );
    }

    /**
     * Test that getUser returns null if the token is invalid
     */
    public function testGetUserReturnsNullIfInvalidToken()
    {
        $this->jwtEncoder->decode(Argument::any())->willThrow(
            $this->prophesize(JWTDecodeFailureException::class)->reveal()
        );

        $userProvider = $this->prophesize(UserProviderInterface::class);
        $userProvider->loadUserByUsername(Argument::any())->willReturn('A USER');

        self::assertEquals(
            null,
            $this->service->getUser('credentials', $userProvider->reveal())
        );

        $this->jwtEncoder->decode('credentials')->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that checkCredentials fetches and returns the users from the token
     */
    public function testGetUserReturnsUserFromValidToken()
    {
        $this->jwtEncoder->decode(Argument::any())->willReturn(['username' => 'user']);

        $userProvider = $this->prophesize(UserProviderInterface::class);
        $userProvider->loadUserByUsername(Argument::any())->willReturn('A USER');

        self::assertEquals(
            'A USER',
            $this->service->getUser('credentials', $userProvider->reveal())
        );

        $this->jwtEncoder->decode('credentials')->shouldHaveBeenCalledTimes(1);
        $userProvider->loadUserByUsername('user')->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that checkCredentials always returns true
     */
    public function testCheckCredentialsReturnsTrue()
    {
        self::assertEquals(
            true,
            $this->service->checkCredentials('credentials', $this->prophesize(UserInterface::class)->reveal())
        );
    }

    /**
     * Test that onAuthenticationSuccess always returns null
     */
    public function testOnAuthenticationSuccessReturnsNull()
    {
        self::assertEquals(
            null,
            $this->service->onAuthenticationSuccess(
                $this->prophesize(Request::class)->reveal(),
                $this->prophesize(TokenInterface::class)->reveal(),
                'providerKey'
            )
        );
    }

    /**
     * Test that onAuthenticationFailure returns a JsonResponse with the correct message
     */
    public function testOnAuthenticationFailureReturnsJsonResponse()
    {
        $exception = $this->prophesize(AuthenticationException::class);
        $exception->getMessageKey()->willReturn('Authentication Failure');
        $exception->getMessageData()->willReturn(['Failure' => 'Failed']);

        $response = $this->service->onAuthenticationFailure(
            $this->prophesize(Request::class)->reveal(),
            $exception->reveal()
        );

        self::assertEquals(
            Response::HTTP_FORBIDDEN,
            $response->getStatusCode()
        );
        self::assertEquals(
            json_encode(['message' => 'Authentication Failed']),
            $response->getContent()
        );
    }

    /**
     * Test that start returns a JsonResponse with the correct message
     */
    public function testStartReturnsJsonResponse()
    {
        $response = $this->service->start($this->prophesize(Request::class)->reveal());
        self::assertEquals(
            Response::HTTP_UNAUTHORIZED,
            $response->getStatusCode()
        );
        self::assertEquals(
            json_encode(['message' => 'Authentication Required']),
            $response->getContent()
        );
    }

    /**
     * Test that supportsRememberMe always returns true
     */
    public function testSupportsRememberMeReturnsFalse()
    {
        self::assertEquals(
            false,
            $this->service->supportsRememberMe()
        );
    }
}
