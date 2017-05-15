<?php

namespace ItsGoingToBeBundle\Service;

use Symfony\Component\Security\Core\Event\AuthenticationFailureEvent;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\RequestStack;
use ItsGoingToBeBundle\Entity\LoginAttempt;

class AuthenticationListener
{
    protected $em;
    private $requestStack;

    function __construct(EntityManager $em, RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->em = $em;
    }
    /**
     * onAuthenticationFailure
     *
     * @param   AuthenticationFailureEvent $event
     */
    public function onAuthenticationFailure( AuthenticationFailureEvent $event )
    {
        // executes on failed login
        $request = $this->requestStack->getCurrentRequest();

        $loginModel = new LoginAttempt();
        $loginModel->setSuccesful(FALSE);
        $loginModel->setIp($request->server->get('REMOTE_ADDR'));
        $loginModel->setUsername($question = $request->request->get('_username', ''));
        $loginModel->setPassword($question = $request->request->get('_password', ''));
        $this->em->persist($loginModel);

        $this->em->flush();

        $response = new Response();
        $response->setContent("Login unsuccessful");

        return $response;
    }

    /**
     * onAuthenticationSuccess
     *
     * @param   InteractiveLoginEvent $event
     */
    public function onAuthenticationSuccess( InteractiveLoginEvent $event )
    {
        // executes on successful login
        $request = $this->requestStack->getCurrentRequest();

        $loginModel = new LoginAttempt();
        $loginModel->setSuccesful(TRUE);
        $loginModel->setIp($request->server->get('REMOTE_ADDR'));
        $loginModel->setUsername($question = $request->request->get('_username', ''));
        $this->em->persist($loginModel);

        $this->em->flush();

        $response = new Response();
        $response->setContent("Login successful");

        return $response;
    }
}