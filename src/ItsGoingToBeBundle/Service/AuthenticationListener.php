<?php

namespace ItsGoingToBeBundle\Service;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\RequestStack;
use ItsGoingToBeBundle\Entity\LoginAttempt;

/**
 * ItsGoingToBeBundle\Service\AuthenticationListener
 */
class AuthenticationListener
{
    protected $em;
    private $requestStack;

    public function __construct(EntityManager $em, RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->em = $em;
    }
    /**
     * onAuthenticationFailure
     */
    public function onAuthenticationFailure()
    {
        // executes on failed login
        $request = $this->requestStack->getCurrentRequest();

        $loginModel = new LoginAttempt();
        $loginModel->setSuccesful(false);
        $loginModel->setIp($request->server->get('REMOTE_ADDR'));
        $loginModel->setUsername($request->request->get('_username', ''));
        $loginModel->setPassword($request->request->get('_password', ''));
        $this->em->persist($loginModel);

        $this->em->flush();

        $response = new Response();
        $response->setContent("Login unsuccessful");

        return $response;
    }

    /**
     * onAuthenticationSuccess
     */
    public function onAuthenticationSuccess()
    {
        // executes on successful login
        $request = $this->requestStack->getCurrentRequest();

        $loginModel = new LoginAttempt();
        $loginModel->setSuccesful(true);
        $loginModel->setIp($request->server->get('REMOTE_ADDR'));
        $loginModel->setUsername($request->request->get('_username', ''));
        $this->em->persist($loginModel);

        $this->em->flush();

        $response = new Response();
        $response->setContent("Login successful");

        return $response;
    }
}
