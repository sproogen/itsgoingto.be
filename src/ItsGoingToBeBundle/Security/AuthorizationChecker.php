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

    /**
     * Constructor.
     *
     * @param AuthorizationCheckerInterface $authorizationChecker
     * @param RequestStack                  $requestStack
     */
    public function __construct(AuthorizationCheckerInterface $authorizationChecker, RequestStack $requestStack)
    {
        $this->authorizationChecker = $authorizationChecker;
        $this->requestStack = $requestStack;
    }

    /**
     * {@inheritdoc}
     */
    final public function isGranted($attributes, $object = null)
    {
        $request = $this->requestStack->getCurrentRequest();
        $user = $request->query->get('user');
        // TODO : Only do this if in 'test' env
        if (!$user) {
            $user = $request->request->get('name');
        }

        if ($user === 'admin') {
            return true;
        }

        return $this->authorizationChecker->isGranted($attributes, $object);
    }
}
