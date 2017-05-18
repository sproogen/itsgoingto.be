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
     * Number of entities to return per page.
     *
     * @var integer
     */
    protected $pageSize = 1;

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
    public function questionsAction(Request $request, $identifier)
    {
        switch ($request->getMethod()) {
            case 'GET':
                // If GET is used and a non-zero ID is passed, call the retrieve method.
                if ($identifier) {
                    return $this->retrieveQuestion($identifier);
                } // Without an ID ($id is 0), call index
                else {
                    return $this->indexQuestions($request->query->all());
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
     * @return JsonResponse
     */
    protected function retrieveQuestion($identifier)
    {
        $findOneBy = array('identifier' => $identifier);
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            $findOneBy['deleted'] = false;
        }
        $question = $this->em->getRepository('ItsGoingToBeBundle:Question')
            ->findOneBy($findOneBy);

        if ($question) {
            $extractedQuestion = $question->extract();
            $extractedQuestion['answers'] = [];
            foreach ($question->getAnswers() as $answer) {
                $extractedQuestion['answers'][] = $answer->extract();
            }
            // TODO : Add Users Response
            $response = new JsonResponse($extractedQuestion);
        } else {
            $response = new JsonResponse([], 404);
        }

        return $response;
    }

    /**
     * Get the questions with parameters
     * @param  String $parameters
     * @return Questions[]
     */
    protected function indexQuestions($parameters)
    {
        $pageSize = 1;

        $queryBuilder = $this->em->getRepository('ItsGoingToBeBundle:Question')
            ->createQueryBuilder('a')
            ->where('1 = 1');

        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            $queryBuilder->andWhere('a.deleted = false');
        }

        $count = $this->countResults($queryBuilder);

        $this->applyPage($queryBuilder, $parameters);
        $questions = $queryBuilder->getQuery()->getResult();

        $extractedQuestions = [];
        foreach ($questions as $question) {
            $extractedQuestions[] = $question->extract();
        }

        return new JsonResponse([
            'count' => count($extractedQuestions),
            'total' => (integer) $count,
            'entities' => $extractedQuestions,
        ]);
    }

    /**
     * Get a count of the results.
     *
     * @param object $queryBuilder Query builder.
     *
     * @return mixed
     */
    protected function countResults($queryBuilder)
    {
        $countQuery = clone($queryBuilder);
        $countQuery->select('COUNT(a.id)');

        return $countQuery->getQuery()->getSingleScalarResult();
    }

    /**
     * Applies the page to the get query.
     *
     * @param object $queryBuilder Query builder.
     * @param array $parameters GET parameters.
     */
    protected function applyPage($queryBuilder, $parameters)
    {
        $page = isset($parameters['page']) ? ($parameters['page']-1) : 0;

        $pageSize = isset($parameters['pageSize']) ? $parameters['pageSize'] : $this->pageSize;

        $queryBuilder->setFirstResult($page * $pageSize);
        $queryBuilder->setMaxResults($pageSize);
    }
}
