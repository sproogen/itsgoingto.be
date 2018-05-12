<?php

namespace App\Interfaces;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 *  Interface for an ApiController
 */
interface ApiControllerInterface
{
    public function apiAction(Request $request, $identifier);
}
