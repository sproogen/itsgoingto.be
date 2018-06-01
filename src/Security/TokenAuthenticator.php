<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor;
use App\Entity\User;

/**
 * App\Security\TokenAuthenticator
 */
class TokenAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var JWTEncoderInterface
     */
    private $jwtEncoder;

    /**
     * @var AuthorizationHeaderTokenExtractor
     */
    private $extractor;

    /**
     * @param JWTEncoderInterface
     */
    public function __construct(JWTEncoderInterface $jwtEncoder)
    {
        $this->jwtEncoder = $jwtEncoder;

        $this->extractor = new AuthorizationHeaderTokenExtractor(
            'Bearer',
            'Authorization'
        );
    }

    public function supports(Request $request)
    {
        unset($request);

        return true;
    }

    public function getCredentials(Request $request)
    {
        return $this->extractor->extract($request);
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        try {
            $data = $this->jwtEncoder->decode($credentials);
        } catch (JWTDecodeFailureException $exception) {
            return;
        }

        return $userProvider->loadUserByUsername($data['username']);
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        unset($credentials);
        unset($user);

        return true;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        unset($request);
        unset($token);
        unset($providerKey);

        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        unset($request);
        unset($exception);

        return null;
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        unset($request);
        unset($authException);

        return null;
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
