<?php

namespace ItsGoingToBeBundle\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Doctrine\ORM\EntityManager;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor;
use ItsGoingToBeBundle\Entity\User;

/**
 * ItsGoingToBeBundle\Security\TokenAuthenticator
 *
 * TODO : Test this
 */
class TokenAuthenticator extends AbstractGuardAuthenticator
{
    private $jwtEncoder;
    private $em;

    public function __construct(JWTEncoderInterface $jwtEncoder, EntityManager $em)
    {
        $this->jwtEncoder = $jwtEncoder;
        $this->em = $em;
    }

    public function getCredentials(Request $request)
    {
        $extractor = new AuthorizationHeaderTokenExtractor(
            'Bearer',
            'Authorization'
        );

        $token = $extractor->extract($request);

        if (!$token) {
            return;
        }

        return $token;
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        unset($userProvider);

        $data = $this->jwtEncoder->decode($credentials);

        if ($data === false) {
            throw new CustomUserMessageAuthenticationException('Invalid Token');
        }

        $username = $data['username'];

        return $this->em
            ->getRepository(User::class)
            ->findOneBy(['username' => $username]);
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        unset($credentials);
        unset($user);

        return true;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        unset($request);
        unset($exception);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        unset($request);
        unset($token);
        unset($providerKey);
    }

    public function supportsRememberMe()
    {
        return false;
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        unset($request);
        unset($authException);

        return new Response('Token is missing!', Response::HTTP_UNAUTHORIZED);
    }
}
