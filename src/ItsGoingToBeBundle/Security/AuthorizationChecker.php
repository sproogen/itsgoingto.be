<?php

namespace ItsGoingToBeBundle\Security;

use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * AuthorizationChecker intercept the default authorization checker to add some testing logic.
 *
 * This will be replaced when propper API authentication is implemented.
 */
class AuthorizationChecker implements AuthorizationCheckerInterface
{
    private $authorizationChecker;
    private $requestStack;
    private $env;

    /**
     * Constructor.
     *
     * @param AuthorizationCheckerInterface $authorizationChecker
     * @param RequestStack                  $requestStack
     * @param String                        $env
     */
    public function __construct(AuthorizationCheckerInterface $authorizationChecker, RequestStack $requestStack, $env)
    {
        $this->authorizationChecker = $authorizationChecker;
        $this->requestStack = $requestStack;
        $this->env = $env;
    }

    /**
     * {@inheritdoc}
     */
    final public function isGranted($attributes, $object = null)
    {
        if ($this->env === 'test') {
            $request = $this->requestStack->getCurrentRequest();
            $user = $request->query->get('user');
            if (!$user) {
                $user = $request->request->get('user');
            }

            if ($user === 'admin') {
                return true;
            }
        } else {
            return $this->authorizationChecker->isGranted($attributes, $object);
        }
    }
}
