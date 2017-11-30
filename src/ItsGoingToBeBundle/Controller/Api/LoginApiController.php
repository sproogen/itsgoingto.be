<?php

namespace ItsGoingToBeBundle\Controller\Api;

use \Datetime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use ItsGoingToBeBundle\Interfaces\ApiControllerInterface;
use ItsGoingToBeBundle\AbstractClass\BaseApiController;
use ItsGoingToBeBundle\Entity\User;

/**
 *  Api Controller to manage authentication of users.
 */
class LoginApiController extends BaseApiController implements ApiControllerInterface
{
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
        if ($request->getMethod() === 'POST') {
            $response = $this->loginUser($this->getData($request));
        } else {
            throw new HttpException('405', 'Method not allowed.');
        }

        return $response;
    }

    /**
     * Login in the user and create the response.
     *
     * @param  array $data
     *
     * @return JsonResponse
     */
    protected function loginUser($data)
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

        if (empty($errors)) {
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['username' => $username]);

            if (!$user || !$user->checkPassword($password)) {
                $errors[] = 'Username or password incorrect';
            } else {
                $extractedUser = $user->extract();
                $extractedUser['token'] = $this->getToken($user);

                $response = new JsonResponse($extractedUser);
            }
        }

        if (!empty($errors)) {
            $response = new JsonResponse(['errors' => $errors], 400);
        }

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
        return $this->container->get('lexik_jwt_authentication.encoder')
            ->encode([
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
        $tokenTtl = $this->container->getParameter('lexik_jwt_authentication.token_ttl');
        $now = new \DateTime();
        $now->add(new \DateInterval('PT'.$tokenTtl.'S'));

        return $now->format('U');
    }
}
