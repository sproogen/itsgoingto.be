<?php

namespace ItsGoingToBeBundle\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use ItsGoingToBeBundle\Entity\Poll;

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
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function setEntityManager(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Action for the index page
     *
     * Matches / route exactly
     *
     * @param  string $url The url passed in for the react app.
     */
    public function indexAction($url)
    {
        // If we get here and we are in prod then we have likely hit a scraper and so just want to show the metatags.
        if ($this->container->getParameter('kernel.environment') === 'prod') {
            $poll = $this->em->getRepository(Poll::class)
                ->findOneBy(['identifier' => $url, 'deleted' => false]);

            return $this->render('react/meta.html.twig', array(
                'poll' => $poll
            ));
        } else {
            return $this->render('react/dev.html.twig');
        }
    }
}
