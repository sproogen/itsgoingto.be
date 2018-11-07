<?php

namespace App\AbstractClass;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use App\Service\IdentifierService;
use App\Service\PollEndService;
use App\Entity\Poll;
use App\Entity\UserResponse;

/**
 *  Base APIy goodness.
 */
abstract class BaseApiController extends Controller
{
    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @var AuthorizationCheckerInterface
     */
    protected $authorizationChecker;

    /**
     * @var IdentifierService
     */
    protected $identifierService;

    /**
     * @var PollEndService
     */
    protected $pollEndService;

    /**
     * @var String
     */
    protected $projectDir;

    /**
     * Number of entities to return per page.
     *
     * @var integer
     */
    protected $pageSize = 20;

    /**
     * @param EntityManagerInterface $entityManager
     * @param AuthorizationCheckerInterface $authorizationChecker
     * @param IdentifierService $identifierService
     * @param PollEndService $pollEndService
     */
    public function __construct(
        EntityManagerInterface $em,
        AuthorizationCheckerInterface $authorizationChecker,
        IdentifierService $identifierService,
        PollEndService $pollEndService,
        $projectDir
    ) {
        $this->em = $em;
        $this->authorizationChecker = $authorizationChecker;
        $this->identifierService = $identifierService;
        $this->pollEndService = $pollEndService;
        $this->projectDir = $projectDir;
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
        $data += $request->query->all();

        return $data;
    }

    /**
     * Get a count of the results.
     *
     * @param QueryBuilder $queryBuilder Query builder.
     *
     * @return mixed
     */
    protected function countResults(QueryBuilder $queryBuilder)
    {
        $countQuery = clone $queryBuilder;
        $countQuery->select('COUNT(a.id)');

        return $countQuery->getQuery()->getSingleScalarResult();
    }

    /**
     * TODO : Validation on page parameter
     *
     * Applies the page to the get query.
     *
     * @param QueryBuilder $queryBuilder Query builder.
     * @param array        $parameters   GET parameters.
     */
    protected function applyPage(QueryBuilder &$queryBuilder, $parameters)
    {
        $page = isset($parameters['page']) ? ($parameters['page']-1) : 0;

        $pageSize = isset($parameters['pageSize']) ? $parameters['pageSize'] : $this->pageSize;

        $queryBuilder->setFirstResult($page * $pageSize);
        $queryBuilder->setMaxResults($pageSize);
    }

    /**
     * Map function to get entity ids
     *
     * @param $entity
     *
     * @param integer $id
     */
    protected function mapIds($entity)
    {
        return $entity->getId();
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
        $responseRepository = $this->em->getRepository(UserResponse::class);
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
}
