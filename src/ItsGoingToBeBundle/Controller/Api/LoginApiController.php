<?php

namespace ItsGoingToBeBundle\Controller\Api;

use \Datetime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use ItsGoingToBeBundle\Interfaces\ApiControllerInterface;
use ItsGoingToBeBundle\AbstractClass\BaseApiController;
use ItsGoingToBeBundle\Entity\User;
use ItsGoingToBeBundle\Entity\LoginAttempt;

/**
 *  Api Controller to manage authentication of users.
 */
class LoginApiController extends BaseApiController implements ApiControllerInterface
{
    /**
     * @var UserPasswordEncoderInterface
     */
    protected $encoder;

    /**
     * @var JWTEncoderInterface
     */
    protected $jwtEncoder;

    /**
     * @var integer
     */
    protected $tokenTTL;

    /**
     * @param UserPasswordEncoderInterface $encoder
     */
    public function setEncoder(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * @param JWTEncoderInterface $jwtEncoder
     */
    public function setJWTEncoder(JWTEncoderInterface $jwtEncoder)
    {
        $this->jwtEncoder = $jwtEncoder;
    }

    /**
     * @param integer $tokenTTL
     */
    public function setTokenTTL($tokenTTL)
    {
        $this->tokenTTL = $tokenTTL;
    }

    /**
     * Uses the HTTP method to decide which action to perform.
     *
     * @param  Request   $request    The request object.
     * @param  mixed     $identifier An identifier that is not used here, 0 by default.
     *
     * @return JsonResponse        The API response
     */
    public function apiAction(Request $request, $identifier)
    {
        unset($identifier);

        switch ($request->getMethod()) {
            case 'POST':
                $response = $this->loginUser($this->getData($request), $request->getClientIp());
                break;
            case 'OPTIONS':
                $response = new Response();
                break;
            default:
                throw new HttpException('405', 'Method not allowed.');
        }
        return $response;
    }

    /**
     * Login in the user and create the response.
     *
     * @param  array  $data
     * @param  string $ip   The clients IP address
     *
     * @return JsonResponse
     */
    protected function loginUser($data, $ip)
    {
        $errors = [];
        $username = isset($data['username']) ? $data['username'] : '';
        $password = isset($data['password']) ? $data['password'] : '';

        if (strlen(trim($username)) === 0) {
            $errors[] = 'No username has been provided';
        }
        if (strlen(trim($password)) === 0) {
            $errors[] = 'No password has been provided';
        }

        $loginAttempt = new LoginAttempt();
        $loginAttempt->setSuccesful(true);
        $loginAttempt->setIp($ip);
        $loginAttempt->setUsername($username);

        if (empty($errors)) {
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['username' => $username]);

            if (!$user || !$this->encoder->isPasswordValid($user, $password)) {
                $errors[] = 'Username or password incorrect';

                $loginAttempt->setPassword($password); // Only save the password if we know it is incorrect
            } else {
                $extractedUser = $user->extract();
                $extractedUser['token'] = $this->getToken($user);
                $response = new JsonResponse($extractedUser);
            }
        }

        if (!empty($errors)) {
            $response = new JsonResponse(['errors' => $errors], Response::HTTP_BAD_REQUEST);
            $loginAttempt->setSuccesful(false);
        }

        $this->em->persist($loginAttempt);
        $this->em->flush();

        return $response;
    }

    /**
     * Returns token for user.
     *
     * @param User $user
     *
     * @return array
     */
    public function getToken(User $user)
    {
        return $this->jwtEncoder->encode([
            'username' => $user->getUsername(),
            'exp' => $this->getTokenExpiryDateTime(),
        ]);
    }

    /**
     * Returns token expiration datetime.
     *
     * @return string Unixtmestamp
     */
    private function getTokenExpiryDateTime()
    {
        $now = new \DateTime();
        $now->add(new \DateInterval('PT'.$this->tokenTTL.'S'));

        return $now->format('U');
    }
}
