<?php

namespace ItsGoingToBeBundle\Controller\Api;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use ItsGoingToBeBundle\Interfaces\ApiControllerInterface;
use ItsGoingToBeBundle\AbstractClass\BaseApiController;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 *  Api Controller to manage all APIy goodness for polls
 */
class ResponseApiController extends BaseApiController implements ApiControllerInterface
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
        $poll = $this->em->getRepository(Poll::class)
            ->findOneBy(array('identifier' => $identifier, 'deleted' => false, 'ended' => false));

        if ($poll) {
            $data = $this->getData($request);
            if (!$this->authorizationChecker->isGranted('ROLE_ADMIN') &&
                $poll->hasPassphrase() &&
                $poll->getPassphrase() !== (isset($data['passphrase']) ? $data['passphrase'] : '')) {
                $response = new JsonResponse(['error' => 'incorrect-passphrase'], 401);
            } else {
                $poll = $this->pollEndService->updateIfEnded($poll);

                switch ($request->getMethod()) {
                    case 'GET':
                        $response = $this->indexResponses($poll, $request);
                        break;
                    case 'POST':
                        if ($poll->isEnded()) {
                            // The poll has just ended, return a 400
                            $response = new JsonResponse(['error' => 'poll-ended'], 400);
                        } else {
                            $response = $this->createResponse($poll, $request, $data);
                        }
                        break;
                    case 'OPTIONS':
                        $response = new Response();
                        break;
                    default:
                        throw new HttpException('405', 'Method not allowed.');
                }
            }
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
                $answer = $this->em->getRepository(Answer::class)
                    ->findOneBy(array('id' => $answer, 'poll' => $poll->getId()));
                if ($answer) {
                    $answers[] = $answer;
                    if (!$poll->isMultipleChoice()) {
                        break;
                    }
                }
            }
        }

        if (count($answers) === 0 && !$poll->isMultipleChoice()) {
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
                } else {
                    $userResponse->getAnswer()->removeResponse($userResponse);
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
        $responseRepository = $this->em->getRepository(UserResponse::class);
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
}
