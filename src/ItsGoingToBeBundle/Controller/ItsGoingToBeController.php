<?php

namespace ItsGoingToBeBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\Session;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Class ItsGoingToBeController
 * @package ItsGoingToBeBundle\ObjectiveBundle\Controller
 *
 * Controller for the app UI.
 */
class ItsGoingToBeController extends Controller
{

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
     * Action for adding a new question
     *
     * Matches /question POST route exactly
     */
    public function questionPostAction()
    {
        $request = Request::createFromGlobals();

        //Check the question
        $question = $request->request->get('question', '');
        if(strlen(trim($question)) == 0){
            //ERROR - NO QUESTION SET
            return $this->redirectToRoute('question', array());
        }

        //Check the answers
        $answers = array();
        $x = 1;
        do {
            $answer = $request->request->get('answer-'.$x, false);
            if($answer !== false && strlen(trim($answer)) > 0){
                $answers[] = $answer;
            }
            $x++;
        } while($answer !== false);
        if(count($answers) < 2){
            //ERROR - NOT ENOUGH ANSWERS GIVEN
            return $this->redirectToRoute('question', array());
        }

        //We have a valid question and answers

        //Generate a random identifier
        $identifier = null;
        do {
            $identifier = substr(chr( mt_rand( 97 ,122 ) ) .substr( md5( time( ) ) ,1 ),0,8);
            $duplicateQuestion = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:Question')
                ->findOneByIdentifier($identifier);
            if ($duplicateQuestion != null) $identifier = null;
        } while ($identifier == null);

        $em = $this->getDoctrine()->getManager();

        $multipleChoice = $request->request->get('multiple', false);
        if($multipleChoice === "1") $multipleChoice = true;

        $questionModel = new Question();
        $questionModel->setIdentifier($identifier);
        $questionModel->setQuestion($question);
        $questionModel->setMultipleChoice($multipleChoice);
        $em->persist($questionModel);

        foreach ($answers as $answer) {
            $answerModel = new Answer();
            $answerModel->setAnswer($answer);
            $answerModel->setQuestion($questionModel);
            $em->persist($answerModel);
        }

        $em->flush();

        return $this->redirectToRoute('answer', array('identifier' => $identifier));
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
        }else{
            $questionModel = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:Question')
                ->findOneBy(array('identifier' => $identifier, 'deleted' => FALSE));
        }
        if(!$questionModel){
            throw $this->createNotFoundException('The question could not be found');
        }

        if(!$questionModel->getMultipleChoice()){

            //Check if the user has already answered the question
            $responseModel = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:UserResponse')
                ->findOneBy(array('customUserID' => $this->getCustomUserID($request), 'question' => $questionModel->getId()));
            if(!$responseModel){
                $responseModel = $this->getDoctrine()
                    ->getRepository('ItsGoingToBeBundle:UserResponse')
                    ->findOneBy(array('userSessionID' => $this->getSessionID($request), 'question' => $questionModel->getId()));
            }
            if($responseModel){
                $em = $this->getDoctrine()->getManager();
                $responseModel->setCustomUserID($this->getCustomUserID($request));
                $responseModel->setUserSessionID($this->getSessionID($request));
                $em->persist($responseModel);

                $answerModel = $responseModel->getAnswer();
            }else{
                $answerModel = null;
            }
        }else{
            //Check if the user has already answered the question
            $responseModels = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:UserResponse')
                ->findBy(array('customUserID' => $this->getCustomUserID($request), 'question' => $questionModel->getId()));
            if(!$responseModels){
                $responseModels = $this->getDoctrine()
                    ->getRepository('ItsGoingToBeBundle:UserResponse')
                    ->findBy(array('userSessionID' => $this->getSessionID($request), 'question' => $questionModel->getId()));
            }
            if($responseModels){
                foreach($responseModels as $responseModel){
                    $em = $this->getDoctrine()->getManager();
                    $responseModel->setCustomUserID($this->getCustomUserID($request));
                    $responseModel->setUserSessionID($this->getSessionID($request));
                    $em->persist($responseModel);

                    $answerModel[$responseModel->getAnswer()->getId()] = $responseModel->getAnswer();
                }
            }else{
                $answerModel = null;
            }
        }

        return $this->render('itsgoingtobe/answer.html.twig', array(
            'questionModel' => $questionModel,
            'identifier' => $identifier,
            'answerModel' => $answerModel
        ));
    }

    /**
     * Action for adding a new answer
     *
     * Matches /{identifier}/answer POST route
     */
    public function answerPostAction(Request $request, $identifier)
    {
        //Check if the question exists
        $questionModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:Question')
            ->findOneBy(array('identifier' => $identifier, 'deleted' => FALSE));
        if(!$questionModel){
            if($request->isXmlHttpRequest()) {
                return new JsonResponse(array('result' => 'error'));
            } else {
                throw $this->createNotFoundException('The question could not be found');
            }
        }

        if(!$questionModel->getMultipleChoice()){

            //Check if the answer exists
            $answer = $request->request->get('answer');
            if(!$answer){
                if($request->isXmlHttpRequest()) {
                    return new JsonResponse(array('result' => 'error'));
                } else {
                    return $this->redirectToRoute('answer', array('identifier' => $identifier));
                }
            }
            //Check if the answer is for the question
            $answerModel = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:Answer')
                ->findOneBy(array('id' => $answer, 'question' => $questionModel->getId()));
            if(!$answerModel){
                if($request->isXmlHttpRequest()) {
                    return new JsonResponse(array('result' => 'error'));
                } else {
                    return $this->redirectToRoute('answer', array('identifier' => $identifier));
                }
            }

            //Check if the user has already answered the question
            $responseModel = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:UserResponse')
                ->findOneBy(array('customUserID' => $this->getCustomUserID($request), 'question' => $questionModel->getId()));
            if(!$responseModel){
                $responseModel = $this->getDoctrine()
                    ->getRepository('ItsGoingToBeBundle:UserResponse')
                    ->findOneBy(array('userSessionID' => $this->getSessionID($request), 'question' => $questionModel->getId()));
            }
            if($responseModel){
                //User has already answered the question, update the response
                $em = $this->getDoctrine()->getManager();

                $responseModel->setAnswer($answerModel);
                $responseModel->setCustomUserID($this->getCustomUserID($request));
                $responseModel->setUserSessionID($this->getSessionID($request));

                $em->persist($responseModel);
                $em->flush();
            }else{
                $em = $this->getDoctrine()->getManager();

                $responseModel = new UserResponse();
                $responseModel->setQuestion($questionModel);
                $responseModel->setAnswer($answerModel);
                $responseModel->setCustomUserID($this->getCustomUserID($request));
                $responseModel->setUserSessionID($this->getSessionID($request));
                $responseModel->setUserIP($request->server->get('REMOTE_ADDR'));

                $em->persist($responseModel);
                $em->flush();
            }
        }else{

            $answers = $request->request->get('answer', array());

            $responseModels = $this->getDoctrine()
                ->getRepository('ItsGoingToBeBundle:UserResponse')
                ->findBy(array('customUserID' => $this->getCustomUserID($request), 'question' => $questionModel->getId()));
            if(!$responseModels){
                $responseModels = $this->getDoctrine()
                    ->getRepository('ItsGoingToBeBundle:UserResponse')
                    ->findBy(array('userSessionID' => $this->getSessionID($request), 'question' => $questionModel->getId()));
            }
            if($responseModels){
                foreach($responseModels as $responseModel){
                    if( !in_array( $responseModel->getAnswer()->getId(), $answers ) ){
                        $em = $this->getDoctrine()->getManager();

                        $em->remove($responseModel);
                        $em->flush();
                    }
                }
            }

            foreach($answers as $answer) {
                //Check if the answer is for the question
                $answerModel = $this->getDoctrine()
                    ->getRepository('ItsGoingToBeBundle:Answer')
                    ->findOneBy(array('id' => $answer, 'question' => $questionModel->getId()));
                if($answerModel){

                    //Check if the user has already answered the question
                    $responseModel = $this->getDoctrine()
                        ->getRepository('ItsGoingToBeBundle:UserResponse')
                        ->findOneBy(array('customUserID' => $this->getCustomUserID($request), 'question' => $questionModel->getId(), 'answer' => $answerModel->getId()));
                    if(!$responseModel){
                        $responseModel = $this->getDoctrine()
                            ->getRepository('ItsGoingToBeBundle:UserResponse')
                            ->findOneBy(array('userSessionID' => $this->getSessionID($request), 'question' => $questionModel->getId(), 'answer' => $answerModel->getId()));
                    }
                    if(!$responseModel){
                        $em = $this->getDoctrine()->getManager();

                        $responseModel = new UserResponse();
                        $responseModel->setQuestion($questionModel);
                        $responseModel->setAnswer($answerModel);
                        $responseModel->setCustomUserID($this->getCustomUserID($request));
                        $responseModel->setUserSessionID($this->getSessionID($request));
                        $responseModel->setUserIP($request->server->get('REMOTE_ADDR'));

                        $em->persist($responseModel);
                        $em->flush();
                    }
                }
            }
        }

        if($request->isXmlHttpRequest()) {
            return new JsonResponse(array('result' => 'success'));
        } else {
            return $this->redirectToRoute('answer', array('identifier' => $identifier));
        }
    }

    /**
     * Action for getting responses
     *
     * Matches /{identifier}/responses POST route
     */
    public function responsesAction(Request $request, $identifier)
    {
        $questionModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:Question')
            ->findOneBy(array('identifier' => $identifier));

        if(!$questionModel){
            return new JsonResponse(array('result' => 'error'));
        }

        $results = array();

        foreach($questionModel->getAnswers() as $answer){
            $results[] = array('id' => $answer->getId(), 'count' => count($answer->getResponses()));
        }

        return new JsonResponse(array('result' => 'success', 'totalResponses' => count($questionModel->getResponses()), 'results' => $results));
    }

    /**
     * Get the session ID for the user
     *
     * @param  $request
     * @return string Session id
     */
    private function getSessionID($request){
        $session = $request->getSession();

        $logger = $this->get('logger');

        if(!$session instanceof Session){
            $logger->info('Session Not Found');
            $session = new Session();
            $session->start();
        }else{
            if(!$session->isStarted()){
                $logger->info('Session Started');
                $session->start();
            }
            $logger->info('Session Found = '.$session->getId());
        }
        $logger->info('Session ID = '.$session->getId());
        return $session->getId();
    }

    /**
     * Get or generate a custom user id
     *
     * @param  $request
     * @return string   Custom user ID
     */
    private function getCustomUserID($request){
        $userID = $request->cookies->get('USERID');

        $logger = $this->get('logger');

        if(!$userID){
            $logger->info('Custom User ID Not Found');

            $userID = bin2hex(openssl_random_pseudo_bytes(32));
            $cookie = new Cookie('USERID', $userID, time() + (3600 * 24 * 1825));
            $response = new Response();
            $response->headers->setCookie($cookie);
            $response->sendHeaders();

        }
        $logger->info('Custom User ID = '.$userID);
        return $userID;
    }
}
