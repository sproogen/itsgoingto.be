<?php

namespace App\Controller\Api;

use \Datetime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Interfaces\ApiControllerInterface;
use App\AbstractClass\BaseApiController;
use App\Entity\Poll;
use App\Entity\Answer;

/**
 *  Api Controller to manage all APIy goodness for polls
 */
class PollApiController extends BaseApiController implements ApiControllerInterface
{
    /**
     * Uses the HTTP method to decide which action to perform.
     *
     * @param  Request   $request    The request object.
     * @param  mixed     $identifier An identifier for a poll, 0 by default.
     *
     * @return JsonResponse        The API response
     */
    public function apiAction(Request $request, $identifier)
    {
        switch ($request->getMethod()) {
            case 'GET':
                // If GET is used and a non-zero ID is passed, call the retrieve method.
                if ($identifier) {
                    $response = $this->retrievePoll($identifier, $request, $this->getData($request));
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
     * Get a poll given the identifier
     *
     * @param  string $identifier
     * @param  Request $request
     * @param  array $data
     *
     * @return JsonResponse
     */
    protected function retrievePoll($identifier, Request $request, $data)
    {
        $findOneBy = array('identifier' => $identifier);
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            $findOneBy['deleted'] = false;
        }
        $poll = $this->em->getRepository(Poll::class)
            ->findOneBy($findOneBy);

        if ($poll) {
            if (!$this->authorizationChecker->isGranted('ROLE_ADMIN') &&
                $poll->hasPassphrase() &&
                $poll->getPassphrase() !== (isset($data['passphrase']) ? $data['passphrase'] : '')) {
                $response = new JsonResponse(['error' => 'incorrect-passphrase'], Response::HTTP_FORBIDDEN);
            } else {
                $poll = $this->pollEndService->updateIfEnded($poll);

                $extractedPoll = $poll->extract();
                $extractedPoll['answers'] = [];
                foreach ($poll->getAnswers() as $answer) {
                    $extractedPoll['answers'][] = $answer->extract();
                }
                $extractedPoll['userResponses'] = $this->getResponsesForUser($poll, $request, true);

                $response = new JsonResponse($extractedPoll);
            }
        } else {
            $response = new JsonResponse([], Response::HTTP_NOT_FOUND);
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
        if (!$this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            return new JsonResponse([], Response::HTTP_UNAUTHORIZED);
        }

        $queryBuilder = $this->em->getRepository(Poll::class)
            ->createQueryBuilder('a')
            ->where('1 = 1');

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
        $passphrase = isset($data['passphrase']) ? $data['passphrase'] : '';
        $endDate = isset($data['endDate']) ? $data['endDate'] : null;
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
        if ($endDate) {
            $endDate = DateTime::createFromFormat(DateTime::ATOM, $endDate);

            if (!$endDate) {
                $errors[] = 'Invalid endDate format';
            }
        }

        if (empty($errors)) {
            $poll = new Poll();
            $poll->setIdentifier($this->generateIdentifier());
            $poll->setQuestion($question);
            $poll->setMultipleChoice($multipleChoice);
            $poll->setPassphrase($passphrase);

            $poll->setEndDate($endDate);

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
            $response = new JsonResponse(['errors' => $errors], Response::HTTP_BAD_REQUEST);
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

        $poll = $this->em->getRepository(Poll::class)
            ->findOneBy(array('identifier' => $identifier));

        if ($poll) {
            $poll->setDeleted(true);

            $this->em->persist($poll);
            $this->em->flush();

            $extractedPoll = $poll->extract();
            $response = new JsonResponse($extractedPoll);
        } else {
            $response = new JsonResponse([], Response::HTTP_NOT_FOUND);
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
            $duplicatePoll = $this->em->getRepository(Poll::class)
                ->findOneBy(array('identifier' => $identifier));
            if ($duplicatePoll != null) {
                $identifier = null;
            }
        } while ($identifier == null);
        return $identifier;
    }
}
