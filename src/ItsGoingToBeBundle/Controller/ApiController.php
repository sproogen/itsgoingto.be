<?php

namespace ItsGoingToBeBundle\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Service\IdentifierService;

/**
 *  Api Controller to manage all the requests for the apiy goodness.
 */
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
     * @param  Request   $request    The request object.
     * @param  mixed     $identifier An identifier for a poll, 0 by default.
     *
     * @return JsonResponse        The API response
     */
    public function pollsAction(Request $request, $identifier)
    {
        switch ($request->getMethod()) {
            case 'GET':
                // If GET is used and a non-zero ID is passed, call the retrieve method.
                if ($identifier) {
                    $response = $this->retrievePoll($identifier, $request);
                } // Without an ID ($id is 0), call index
                else {
                    $response = $this->indexPolls($request->query->all());
                }
                break;
            case 'POST':
                $response = $this->createPoll($this->getData($request));
                break;
            case 'DELETE':
                $response = $this->deletePoll($identifier);
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
     * Uses the HTTP method to decide which action to perform.
     *
     * @param  Request   $request    The request object.
     * @param  mixed     $identifier An identifier for a poll, 0 by default.
     *
     * @return JsonResponse        The API response
     */
    public function responsesAction(Request $request, $identifier)
    {
        $poll = $this->em->getRepository('ItsGoingToBeBundle:Poll')
            ->findOneBy(array('identifier' => $identifier, 'deleted' => false));

        if ($poll) {
            switch ($request->getMethod()) {
                case 'GET':
                    $response = $this->indexResponses($poll, $request);
                    break;
                case 'POST':
                    $response = $this->createResponse($poll, $request, $this->getData($request));
                    break;
                case 'OPTIONS':
                    $response = new Response();
                    break;
                default:
                    throw new HttpException('405', 'Method not allowed.');
            }
        } else {
            $response = new JsonResponse([], 404);
        }
        return $response;
    }

    /**
     * Fetches the POST data.
     *
     * @param Request $request
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
     * Get a poll given the identifier
     *
     * @param  string $identifier
     * @param  Request $request
     *
     * @return JsonResponse
     */
    protected function retrievePoll($identifier, Request $request)
    {
        $findOneBy = array('identifier' => $identifier);
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            $findOneBy['deleted'] = false;
        }
        $poll = $this->em->getRepository('ItsGoingToBeBundle:Poll')
            ->findOneBy($findOneBy);

        if ($poll) {
            $extractedPoll = $poll->extract();
            $extractedPoll['answers'] = [];
            foreach ($poll->getAnswers() as $answer) {
                $extractedPoll['answers'][] = $answer->extract();
            }
            $extractedPoll['userResponses'] = $this->getResponsesForUser($poll, $request, true);

            $response = new JsonResponse($extractedPoll);
        } else {
            $response = new JsonResponse([], 404);
        }

        return $response;
    }

    /**
     * Get the polls with parameters
     *
     * @param  array $parameters
     *
     * @return JsonResponse
     */
    protected function indexPolls($parameters)
    {
        $queryBuilder = $this->em->getRepository('ItsGoingToBeBundle:Poll')
            ->createQueryBuilder('a')
            ->where('1 = 1');

        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            $queryBuilder->andWhere('a.deleted = false');
        }

        $count = $this->countResults($queryBuilder);

        $this->applyPage($queryBuilder, $parameters);
        $polls = $queryBuilder->getQuery()->getResult();

        $extractedPolls = [];
        foreach ($polls as $poll) {
            $extractedPolls[] = $poll->extract();
        }

        return new JsonResponse([
            'count' => count($extractedPolls),
            'total' => (integer) $count,
            'entities' => $extractedPolls,
        ]);
    }

    /**
     * Create a poll given the data
     *
     * @param  array $data
     *
     * @return JsonResponse
     */
    protected function createPoll($data)
    {
        $errors = [];
        $question = isset($data['question']) ? $data['question'] : null;
        $multipleChoice = isset($data['multipleChoice']) ? $data['multipleChoice'] : false;
        $answers = [];
        foreach (isset($data['answers'])? $data['answers']: [] as $answer) {
            if (strlen(trim($answer)) !== 0) {
                $answers[] = $answer;
            }
        }

        if (strlen(trim($question)) === 0) {
            $errors[] = 'No question has been provided';
        }
        if (count($answers) === 0) {
            $errors[] = 'No answers have been provided';
        }

        if (empty($errors)) {
            $poll = new Poll();
            $poll->setIdentifier($this->generateIdentifier());
            $poll->setQuestion($question);
            $poll->setMultipleChoice($multipleChoice);

            foreach ($answers as $answerText) {
                $answer = new Answer();
                $answer->setAnswer($answerText);
                $poll->addAnswer($answer);
            }

            $this->em->persist($poll);
            $this->em->flush();

            $extractedPoll = $poll->extract();
            $extractedPoll['answers'] = [];
            foreach ($poll->getAnswers() as $answer) {
                $extractedPoll['answers'][] = $answer->extract();
            }
            $extractedPoll['userResponses'] = [];

            $response = new JsonResponse($extractedPoll);
        } else {
            $response = new JsonResponse(['errors' => $errors], 400);
        }

        return $response;
    }

    /**
     * Delete the poll given the identifier
     *
     * @param  string $identifier
     *
     * @return JsonResponse
     */
    protected function deletePoll($identifier)
    {
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            return new JsonResponse([], 401);
        }

        $poll = $this->em->getRepository('ItsGoingToBeBundle:Poll')
            ->findOneBy(array('identifier' => $identifier));

        if ($poll) {
            $poll->setDeleted(true);

            $this->em->persist($poll);
            $this->em->flush();

            $extractedPoll = $poll->extract();
            $response = new JsonResponse($extractedPoll);
        } else {
            $response = new JsonResponse([], 404);
        }

        return $response;
    }

    /**
     * Get the responses for a poll
     *
     * @param  Poll $poll
     *
     * @return JsonResponse
     */
    protected function indexResponses(Poll $poll, Request $request)
    {
        $responses = [];
        $responses['userResponses'] = $this->getResponsesForUser($poll, $request, true);
        $responses['responsesCount'] = count($poll->getResponses());
        $responses['answers'] = [];
        foreach ($poll->getAnswers() as $answer) {
            $responses['answers'][] = [
                'id'             => $answer->getId(),
                'responsesCount' => count($answer->getResponses())
            ];
        }
        return new JsonResponse($responses);
    }

    /**
     * Create or Update a response given the data
     *
     * @param  Poll     $poll
     * @param  Request  $request
     * @param  array    $data
     *
     * @return JsonResponse
     */
    protected function createResponse(Poll $poll, Request $request, $data)
    {
        $errors = [];
        $answers = [];
        foreach (isset($data['answers']) ?
                 is_array($data['answers']) ? $data['answers'] : [$data['answers']] :
                 [] as $answer) {
            if (is_int($answer)) {
                $answer = $this->em->getRepository('ItsGoingToBeBundle:Answer')
                    ->findOneBy(array('id' => $answer, 'poll' => $poll->getId()));
                if ($answer) {
                    $answers[] = $answer;
                    if (!$poll->isMultipleChoice()) {
                        break;
                    }
                }
            }
        }

        if (count($answers) === 0) {
            $errors[] = 'No answers have been provided';
        }

        if (empty($errors)) {
            if ($poll->isMultipleChoice()) {
                $userResponses = $this->getResponsesForUser($poll, $request);
                if ($userResponses) {
                    foreach ($userResponses as $userResponse) {
                        if (!in_array($userResponse->getAnswer()->getId(), array_map([$this, 'mapIds'], $answers))) {
                            $this->em->remove($userResponse);
                        }
                    }
                    $this->em->flush();
                }
            }

            foreach ($answers as $answer) {
                $userResponse = $this->getResponseForUser($poll, $answer, $request);
                if (!$userResponse) {
                    $userResponse = new UserResponse();
                    $userResponse->setPoll($poll);
                }
                $userResponse->setAnswer($answer);
                $userResponse->setCustomUserID($this->identifierService->getCustomUserID($request));
                $userResponse->setUserSessionID($this->identifierService->getSessionID($request));
                $userResponse->setUserIP($request->server->get('REMOTE_ADDR'));

                $this->em->persist($userResponse);
            }
            $this->em->flush();

            $response = $this->indexResponses($poll, $request);
        } else {
            $response = new JsonResponse(['errors' => $errors], 400);
        }

        return $response;
    }

    /**
     * Generate an identifier for a poll
     * IDEA : This could be moved to the prePersist hook.
     *
     * @return string identifier
     */
    protected function generateIdentifier()
    {
        $identifier = null;
        do {
            $identifier = substr(chr(mt_rand(97, 122)) .substr(md5(time()), 1), 0, 8);
            $duplicatePoll = $this->em->getRepository('ItsGoingToBeBundle:Poll')
                ->findOneBy(array('identifier' => $identifier));
            if ($duplicatePoll != null) {
                $identifier = null;
            }
        } while ($identifier == null);
        return $identifier;
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

    /**
     * Get a response for the current user
     *
     * @param  Poll        $poll
     * @param  Answer|null $answer
     * @param  Request     $request
     *
     * @return  UserResponse | null
     */
    protected function getResponseForUser(Poll $poll, $answer, Request $request)
    {
        $responseRepository = $this->em->getRepository('ItsGoingToBeBundle:UserResponse');
        $findOneBy = [
            'poll' => $poll->getId(),
            'customUserID' => $this->identifierService->getCustomUserID($request)
        ];
        if ($poll->isMultipleChoice() && $answer !== null) {
            $findOneBy['answer'] = $answer->getId();
        }
        $userResponse = $responseRepository->findOneBy($findOneBy);
        if (!$userResponse) {
            unset($findOneBy['customUserID']);
            $findOneBy['userSessionID'] = $this->identifierService->getSessionID($request);
            $userResponse = $responseRepository->findOneBy($findOneBy);
        }
        return $userResponse;
    }

    /**
     * Get all responses for the current user
     *
     * @param  Poll     $poll
     * @param  Request  $request
     * @param  bool     $idsOnly Only return the ids on the responses
     *
     * @return  array | null
     */
    protected function getResponsesForUser(Poll $poll, Request $request, $idsOnly = false)
    {
        $responseRepository = $this->em->getRepository('ItsGoingToBeBundle:UserResponse');
        $userResponses = $responseRepository->findBy([
            'customUserID' => $this->identifierService->getCustomUserID($request),
            'poll' => $poll->getId()
        ]);
        if (!$userResponses) {
            $userResponses = $responseRepository->findBy([
                'userSessionID' => $this->identifierService->getSessionID($request),
                'poll' => $poll->getId()
            ]);
            if (!$userResponses) {
                $userResponses = [];
            }
        }
        if ($idsOnly) {
            foreach ($userResponses as &$userResponse) {
                $userResponse = $userResponse->getAnswer()->getId();
            }
        }
        return $userResponses;
    }

    /**
     * Map function to get entity ids
     *
     * @param $entity
     *
     * @param integer $id
     */
    public function mapIds($entity)
    {
        return $entity->getId();
    }
}
