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
        // If we get here and we are in prod then we have likely hit a scraper and so just want to show the metatags.
        if ($this->container->getParameter('kernel.environment') === 'prod') {
            return $this->render('react/meta.html.twig');
        } else {
            return $this->render('react/dev.html.twig');
        }
    }
}
