<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Interfaces\ApiControllerInterface;
use App\AbstractClass\BaseApiController;
use App\Entity\Poll;
use App\Entity\UserResponse;

/**
 *  Api Controller to manage all APIy goodness for stats
 */
class StatsApiController extends BaseApiController implements ApiControllerInterface
{
    /**
     * Uses the HTTP method to decide which action to perform.
     *
     * @param  Request   $request    The request object.
     * @param  mixed     $identifier An identifier that is not used here, 0 by default.
     *
     * @return JsonResponse          The API response
     */
    public function apiAction(Request $request, $identifier)
    {
        unset($identifier);

        switch ($request->getMethod()) {
            case 'GET':
                $response = $this->getStats();
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
     * Get the polls with parameters
     *
     * @return JsonResponse
     */
    protected function getStats()
    {
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            return new JsonResponse([], Response::HTTP_UNAUTHORIZED);
        }

        $stats = [
            'polls'     => $this->countEntity(Poll::class),
            'responses' => $this->countEntity(UserResponse::class),
        ];

        return new JsonResponse($stats);
    }

    /**
     * Count the number of an entity
     *
     * @param string   $entity The entity to count
     *
     * @return integer         The count of the entity
     */
    protected function countEntity($entity)
    {
        $queryBuilder = $this->em->getRepository($entity)
            ->createQueryBuilder('a')
            ->where('1 = 1');

        return (integer) $this->countResults($queryBuilder);
    }
}
