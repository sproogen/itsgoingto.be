<?php

namespace ItsGoingToBeBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;

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
    public function answerAction($identifier)
    {

        $questionModel = $this->getDoctrine()
            ->getRepository('ItsGoingToBeBundle:Question')
            ->findOneByIdentifier($identifier);

        if($questionModel == null){
            return $this->redirectToRoute('question', array());
        }

        return $this->render('itsgoingtobe/answer.html.twig', array(
            'questionModel' => $questionModel,
        ));
    }
}
