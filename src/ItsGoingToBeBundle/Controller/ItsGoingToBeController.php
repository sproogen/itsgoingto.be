<?php

namespace ItsGoingToBeBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

class ItsGoingToBeController extends Controller
{
    /**
     * @Route("/", name="question")
     */
    public function indexAction()
    {
        return $this->render('itsgoingtobe/index.html.twig');
    }

    /**
     * @Route("/question", name="question-post")
     * @Method("POST")
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

        $questionModel = new Question();
        $questionModel->setIdentifier($identifier);
        $questionModel->setQuestion($question);
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
     * @Route("/{identifier}", name="answer")
     */
    public function answerAction(Request $request, $identifier)
    {

        $questionModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:Question')
            ->findOneByIdentifier($identifier);

        if(!$questionModel){
            return $this->redirectToRoute('question', array());
        }

        //Check if the user has already answered the question
        $responseModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:UserResponse')
            ->findOneBy(array('userSessionID' => $this->getSessionID($request), 'question' => $questionModel->getId()));
        if($responseModel){
            $answerModel = $responseModel->getAnswer();
        }else{
            $answerModel = null;
        }
        
        return $this->render('itsgoingtobe/answer.html.twig', array(
            'questionModel' => $questionModel,
            'identifier' => $identifier,
            'answerModel' => $answerModel
        ));
    }

    /**
     * @Route("/{identifier}/answer", name="answer-post")
     * @Method("POST")
     */
    public function answerPostAction(Request $request, $identifier)
    {
        // @TODO - Add error responses

        //Check if the question exists
        $questionModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:Question')
            ->findOneByIdentifier($identifier);
        if(!$questionModel){
            if($request->isXmlHttpRequest()) {
                return new JsonResponse(array('result' => 'error'));
            } else {
                return $this->redirectToRoute('question', array());
            }
        }

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
            ->findOneBy(array('userSessionID' => $this->getSessionID($request), 'question' => $questionModel->getId()));
        if($responseModel){
            //User has already answered the question, update the response
            $em = $this->getDoctrine()->getManager();

            $responseModel->setAnswer($answerModel);

            $em->persist($responseModel);
            $em->flush();
        }else{
            $em = $this->getDoctrine()->getManager();

            $responseModel = new UserResponse();
            $responseModel->setQuestion($questionModel);
            $responseModel->setAnswer($answerModel);
            $responseModel->setUserSessionID($this->getSessionID($request));
            $responseModel->setUserIP($request->server->get('REMOTE_ADDR'));

            $em->persist($responseModel);
            $em->flush();
        }

        if($request->isXmlHttpRequest()) {
            return new JsonResponse(array('result' => 'success'));
        } else {
            return $this->redirectToRoute('answer', array('identifier' => $identifier));
        }
    }

    private function getSessionID($request){
        $session = $request->getSession();
        if(!$session instanceof Session){
            $session = new Session();
            $session->start();
        }
        return $session->getId();
    }
}
