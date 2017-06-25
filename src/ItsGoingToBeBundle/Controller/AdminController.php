<?php

namespace ItsGoingToBeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

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
        $dql = "SELECT q FROM ItsGoingToBeBundle:Poll p ORDER BY p.id DESC";
        $query = $em->createQuery($dql);

        $paginator  = $this->get('knp_paginator');
        $pagination = $paginator->paginate(
            $query,
            $request->query->getInt('page', 1)/*page number*/,
            10/*limit per page*/
        );

        return $this->render('admin/admin.html.twig', array(
            'pagination' => $pagination,
            'currentPage'=> $request->query->getInt('page', 1)
        ));
    }

    /**
     * Action for the admin delete route
     *
     * Matches /admin/delete route.
     * Only accessable to uses with the 'ROLE_ADMIN' role.
     */
    public function deleteAction(Request $request, $identifier)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');

        $pollModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:Poll')
            ->findOneByIdentifier($identifier);
        if (!$pollModel) {
            throw $this->createNotFoundException('The poll could not be found');
        }

        $em = $this->getDoctrine()->getManager();
        $pollModel->setDeleted(true);
        $em->persist($pollModel);
        $em->flush();

        return $this->redirectToRoute('admin_page', array('page'=>$request->query->getInt('returnToPage', 1)));
    }

    /**
     * Action for the admin login page
     *
     * Matches /admin/login route exactly.
     */
    public function loginAction()
    {
        $authenticationUtils = $this->get('security.authentication_utils');

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render(
            'admin/login.html.twig',
            array(
                // last username entered by the user
                'last_username' => $lastUsername,
                'error'         => $error,
            )
        );
    }

    /**
     * Action for the admin login check action
     *
     * Matches /admin/login-check route exactly.
     */
    public function loginCheckAction()
    {
        // this controller will not be executed,
        // as the route is handled by the Security system
    }
}
