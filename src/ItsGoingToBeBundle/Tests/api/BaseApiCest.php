<?php

namespace ItsGoingToBeBundle\Tests\api;

use ItsGoingToBeBundle\ApiTester;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

abstract class BaseApiCest
{
  protected $em;

  protected $polls;

  protected function createPoll(ApiTester $I, $data)
  {
    $answers = isset($data['answers']) ? $data['answers'] : [];
    unset($data['answers']);

    $pollId = $I->haveInRepository(Poll::class, $data);
    $poll = $this->em->find(Poll::class, $pollId);

    foreach ($answers as $answer) {
      if (!is_array($answer)) {
        $answer = ['answer' => $answer];
      }
      $this->createAnswer($I, $poll, $answer);
    }

    $this->polls[] = $poll;

    return $poll;
  }

  protected function createAnswer(ApiTester $I, Poll $poll, $data)
  {
    $data['poll'] = $poll;
    $responses = isset($data['responses']) ? $data['responses'] : [];
    unset($data['responses']);

    $answerId = $I->haveInRepository(Answer::class, $data);
    $answer = $this->em->find(Answer::class, $answerId);

    $poll->addAnswer($answer);
    $I->persistEntity($poll);

    foreach ($responses as $response) {
      $this->createResponse($I, $poll, $answer, $response);
    }

    return $answer;
  }

  protected function createResponse(ApiTester $I, Poll $poll, Answer $answer, $data)
  {
    $data['poll'] = $poll;
    $data['answer'] = $answer;

    $responseId = $I->haveInRepository(UserResponse::class, $data);
    $response = $this->em->find(UserResponse::class, $responseId);

    $poll->addResponse($response);
    $I->persistEntity($poll);

    $answer->addResponse($response);
    $I->persistEntity($answer);

    return $response;
  }

  public function _before(ApiTester $I)
  {
    $this->em = $I->getEntityManager();

    $this->polls = [];

    $this->createPoll($I, [
      'identifier'     => 'he7gis',
      'question'       => 'Test Question 1',
      'multipleChoice' => false,
      'deleted'        => false,
      'answers'        => [
        [
          'answer'    => 'Answer 1',
          'responses' => [
            [
              'userIP'        => '198.0.1.66',
              'userSessionID' => 'jf0983ryasjd98hud',
              'customUserID'  => 'jd7s6jhd78'
            ],
            [
              'userIP'        => '198.0.1.62',
              'userSessionID' => 'ft65gd43sdgjasdrhg',
              'customUserID'  => 'syj5bdj64f'
            ],
          ],
        ],
        'Answer 2'
      ]
    ]);

    $this->createPoll($I, [
      'identifier'     => 'y3k0sn',
      'question'       => 'Test Question Deleted',
      'multipleChoice' => false,
      'deleted'        => true,
      'answers'        => [
        'Answer Deleted 1',
        'Answer Deleted 2'
      ]
    ]);
  }
}
