<?php

namespace ItsGoingToBeBundle\Service;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Psr\Log\LoggerInterface;

/**
 * ItsGoingToBeBundle\Service\IdentifierService
 */
class IdentifierService
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @param LoggerInterface $logger
     */
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Get the session ID for the user
     *
     * @param  $request
     * @return string Session id
     */
    public function getSessionID(Request $request)
    {
        $session = $request->getSession();

        if (!$session instanceof Session) {
            $this->logger->info('Session Not Found');
            $session = new Session();
            $session->start();
        } else {
            if (!$session->isStarted()) {
                $this->logger->info('Session Started');
                $session->start();
            }
            $this->logger->info('Session Found = '.$session->getId());
        }
        $this->logger->info('Session ID = '.$session->getId());
        return $session->getId();
    }

    /**
     * Get or generate a custom user id
     *
     * @param  $request
     * @return string   Custom user ID
     */
    public function getCustomUserID(Request $request)
    {
        $userID = $request->cookies->get('USERID');

        if (!$userID) {
            $this->logger->info('Custom User ID Not Found');

            $userID = bin2hex(openssl_random_pseudo_bytes(32));
            $cookie = new Cookie('USERID', $userID, time() + (3600 * 24 * 1825));
            $response = new Response();
            $response->headers->setCookie($cookie);
            $response->sendHeaders();
        }
        $this->logger->info('Custom User ID = '.$userID);
        return $userID;
    }
}
