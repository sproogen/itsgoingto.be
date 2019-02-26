<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Psr\Log\LoggerInterface;

/**
 * App\Service\IdentifierService
 *
 * TODO : Test this
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
    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Get or generate a custom user id
     *
     * @param  Request $request
     *
     * @return string   Custom user ID
     */
    public function getCustomUserID(Request $request)
    {
        $userID = $request->cookies->get('USERID');

        $this->logger->info('Custom User ID = '.$userID);
        return $userID;
    }
}
