<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ItsGoingToBeController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        return $this->render('itsgoingtobe/index.html.twig');
    }

    /**
     * @Route("/{id}", name="answer page")
     */
    public function answerAction($id)
    {
        return $this->render('itsgoingtobe/answer.html.twig', array(
            'id' => $id,
        ));
    }
}
