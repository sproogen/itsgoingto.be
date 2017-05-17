<?php

namespace ItsGoingToBeBundle\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Service\IdentifierService;

class ApiController extends Controller
{
    /**
     * @var IdentifierService
     */
    protected $identifierService;

    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var AuthorizationChecker
     */
    protected $authorizationChecker;

    /**
     * @param IdentifierService $identifierService
     */
    public function setIdentifierService(IdentifierService $identifierService)
    {
        $this->identifierService = $identifierService;
    }

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function setEntityManager(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param AuthorizationCheckerInterface $authorizationChecker
     */
    public function setAuthorizationChecker(AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->authorizationChecker = $authorizationChecker;
    }

    /**
     * Uses the HTTP method to decide which action to perform.
     *
     * @param  Request   $request   The request object.
     * @param  int       $id        An ID to retrieve, 0 by default.
     *
     * @return JsonResponse        The API response
     */
    public function questionAction(Request $request, $identifier)
    {
        switch ($request->getMethod()) {
            case 'GET':
                // If GET is used and a non-zero ID is passed, call the retrieve method.
                if ($identifier) {
                    $question = $this->getQuestion($identifier);
                    if ($question) {
                        // TODO : Get responses and current users response
                        $response = new JsonResponse($question->extract());
                    } else {
                        $response = new JsonResponse([], 404);
                    }
                } // Without an ID ($id is 0), call index
                else {
                    // TODO : Index a question
                    $response = new JsonResponse();
                }
                break;
            case 'POST':
                // TODO : Create a new question
                $response = new JsonResponse();
                break;
            case 'DELETE':
                // TODO : Delete a question
                $response = new JsonResponse();
                break;
            case 'OPTIONS':
                $response = new Response();
                break;
            default:
                throw new HttpException('405', 'Method not allowed.');
        }

        return $response;
    }

    /**
     * Get a question given the identifier
     * @param  String $identifier
     * @return Question | null
     */
    protected function getQuestion($identifier)
    {
        $findOneBy = array('identifier' => $identifier);
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            $findOneBy['deleted'] = false;
        }
        $question = $this->em->getRepository('ItsGoingToBeBundle:Question')
            ->findOneBy($findOneBy);
        return $question;
    }
}
