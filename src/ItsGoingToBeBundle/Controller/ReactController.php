<?php

namespace ItsGoingToBeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Class ReactController
 *
 * @package ItsGoingToBeBundle\Controller
 *
 * Controller for the react app.
 */
class ReactController extends Controller
{
    /**
     * Action for the index page
     *
     * Matches / route exactly
     */
    public function indexAction()
    {
        return $this->render('react/dev.html');
    }
}
