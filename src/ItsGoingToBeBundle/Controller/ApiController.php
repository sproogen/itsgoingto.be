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
    protected $pageSize = 20;

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
                    $response = $this->retrieveQuestion($identifier);
                } // Without an ID ($id is 0), call index
                else {
                    $response = $this->indexQuestions($request->query->all());
                }
                break;
            case 'POST':
                $response = $this->createQuestion($this->getData($request));
                break;
            case 'DELETE':
                $response = $this->deleteQuestion($identifier);
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
     * Fetches the POST data.
     *
     * @return array POST data.
     */
    protected function getData(Request $request)
    {
        $data = (array) json_decode($request->getContent(), true);
        $data += $request->request->all();
        return $data;
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
     * @return JsonResponse
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
     * Create a question given the data
     * @param  String $request
     * @return JsonResponse
     */
    protected function createQuestion($data)
    {
        $errors = [];
        $questionText = isset($data['question']) ? $data['question'] : null;
        $multipleChoice = isset($data['multipleChoice']) ? $data['multipleChoice'] : false;
        $answers = [];
        foreach (isset($data['answers'])? $data['answers']: [] as $answer) {
            if (strlen(trim($answer)) !== 0) {
                $answers[] = $answer;
            }
        }

        if (strlen(trim($questionText)) === 0) {
            $errors[] = 'No question has been provided';
        }
        if (count($answers) === 0) {
            $errors[] = 'No answers have been provided';
        }

        if (empty($errors)) {
            $question = new Question();
            $question->setIdentifier($this->generateIdentifier());
            $question->setQuestion($questionText);
            $question->setMultipleChoice($multipleChoice);

            foreach ($answers as $answerText) {
                $answer = new Answer();
                $answer->setAnswer($answerText);
                $question->addAnswer($answer);
            }

            $this->em->persist($question);
            $this->em->flush();

            $extractedQuestion = $question->extract();
            $extractedQuestion['answers'] = [];
            foreach ($question->getAnswers() as $answer) {
                $extractedQuestion['answers'][] = $answer->extract();
            }
            $response = new JsonResponse($extractedQuestion);
        } else {
            $response = new JsonResponse(['errors' => $errors], 400);
        }

        return $response;
    }

    protected function generateIdentifier()
    {
        $identifier = null;
        do {
            $identifier = substr(chr(mt_rand(97, 122)) .substr(md5(time()), 1), 0, 8);
            $duplicateQuestion = $this->em->getRepository('ItsGoingToBeBundle:Question')
                ->findOneBy(array('identifier' => $identifier));
            if ($duplicateQuestion != null) {
                $identifier = null;
            }
        } while ($identifier == null);
        return $identifier;
    }

    /**
     * Delete the question given the identifier
     * @param  String $identifier
     * @return JsonResponse
     */
    protected function deleteQuestion($identifier)
    {
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            return new JsonResponse([], 401);
        }

        $question = $this->em->getRepository('ItsGoingToBeBundle:Question')
            ->findOneBy(array('identifier' => $identifier));

        if ($question) {
            $question->setDeleted(true);

            $this->em->persist($question);
            $this->em->flush();

            $extractedQuestion = $question->extract();
            $response = new JsonResponse($extractedQuestion);
        } else {
            $response = new JsonResponse([], 404);
        }

        return $response;
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
        $countQuery = clone $queryBuilder;
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
