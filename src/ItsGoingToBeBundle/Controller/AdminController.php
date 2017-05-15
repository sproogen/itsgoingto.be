<?php

namespace ItsGoingToBeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class AdminController extends Controller
{
    /**
     * Action for the admin index page
     *
     * Matches /admin route exactly.
     * Only accessable to uses with the 'ROLE_ADMIN' role.
     */
    public function indexAction(Request $request)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');

        $em = $this->get('doctrine.orm.entity_manager');
        $dql = "SELECT q FROM ItsGoingToBeBundle:Question q ORDER BY q.id DESC";
        $query = $em->createQuery($dql);

        $paginator  = $this->get('knp_paginator');
        $pagination = $paginator->paginate(
            $query,
            $request->query->getInt('page', 1)/*page number*/,
            10/*limit per page*/
        );

        return $this->render('admin/admin.html.twig', array('pagination' => $pagination, 'currentPage'=>$request->query->getInt('page', 1)));
    }

    /**
     * Action for the admin delete route
     *
     * Matches /admin route exactly.
     * Only accessable to uses with the 'ROLE_ADMIN' role.
     */
    public function adminDeleteAction(Request $request, $identifier)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');

        $questionModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:Question')
            ->findOneByIdentifier($identifier);

        if(!$questionModel){
            throw $this->createNotFoundException('The question could not be found');
        }

        $em = $this->getDoctrine()->getManager();

        $questionModel->setDeleted(true);

        $em->persist($questionModel);
        $em->flush();

        return $this->redirectToRoute('admin', array('page'=>$request->query->getInt('returnToPage', 1)));


    }

}
