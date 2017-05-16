<?php

namespace ItsGoingToBeBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Service\IdentifierService;

/**
 * Class ItsGoingToBeController
 *
 * @package ItsGoingToBeBundle\Controller
 *
 * Controller for the app UI.
 */
class ItsGoingToBeController extends Controller
{
    /**
     * @var IdentifierService
     */
    protected $identifierService;

    /**
     * @param IdentifierService $identifierService
     */
    public function setIdentifierService(IdentifierService $identifierService)
    {
        $this->identifierService = $identifierService;
    }

    /**
     * Action for the index page
     *
     * Matches / route exactly
     */
    public function indexAction()
    {
        return $this->render('itsgoingtobe/index.html.twig');
    }

    /**
     * Action for the answer page
     *
     * Matches /{identifier} route
     */
    public function answerAction(Request $request, $identifier)
    {
        $securityContext = $this->container->get('security.context');
        if ($securityContext->isGranted('ROLE_ADMIN')) {
            $questionModel = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:Question')
                ->findOneBy(array('identifier' => $identifier));
        } else {
            $questionModel = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:Question')
                ->findOneBy(array('identifier' => $identifier, 'deleted' => false));
        }
        if (!$questionModel) {
            throw $this->createNotFoundException('The question could not be found');
        }

        if (!$questionModel->getMultipleChoice()) {
            //Check if the user has already answered the question
            $responseModel = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:UserResponse')
                ->findOneBy(array(
                    'customUserID' => $this->identifierService->getCustomUserID($request),
                    'question' => $questionModel->getId()
                ));
            if (!$responseModel) {
                $responseModel = $this->getDoctrine()
                    ->getRepository('ItsGoingToBeBundle:UserResponse')
                    ->findOneBy(array(
                        'userSessionID' => $this->identifierService->getSessionID($request),
                        'question' => $questionModel->getId()
                    ));
            }
            if ($responseModel) {
                $em = $this->getDoctrine()->getManager();
                $responseModel->setCustomUserID($this->identifierService->getCustomUserID($request));
                $responseModel->setUserSessionID($this->identifierService->getSessionID($request));
                $em->persist($responseModel);

                $answerModel = $responseModel->getAnswer();
            } else {
                $answerModel = null;
            }
        } else {
            //Check if the user has already answered the question
            $responseModels = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:UserResponse')
                ->findBy(array(
                    'customUserID' => $this->identifierService->getCustomUserID($request),
                    'question' => $questionModel->getId()
                ));
            if (!$responseModels) {
                $responseModels = $this->getDoctrine()
                    ->getRepository('ItsGoingToBeBundle:UserResponse')
                    ->findBy(array(
                        'userSessionID' => $this->identifierService->getSessionID($request),
                        'question' => $questionModel->getId()
                    ));
            }
            if ($responseModels) {
                foreach ($responseModels as $responseModel) {
                    $em = $this->getDoctrine()->getManager();
                    $responseModel->setCustomUserID($this->identifierService->getCustomUserID($request));
                    $responseModel->setUserSessionID($this->identifierService->getSessionID($request));
                    $em->persist($responseModel);

                    $answerModel[$responseModel->getAnswer()->getId()] = $responseModel->getAnswer();
                }
            } else {
                $answerModel = null;
            }
        }

        return $this->render(
            'itsgoingtobe/answer.html.twig', array(
            'questionModel' => $questionModel,
            'identifier' => $identifier,
            'answerModel' => $answerModel
            )
        );
    }
}
