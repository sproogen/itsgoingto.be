<?php

namespace ItsGoingToBeBundle\Tests\api;

use ItsGoingToBeBundle\ApiTester;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;

abstract class BaseApiCest
{
  protected $em;

  protected function createPoll(ApiTester $I, $data)
  {
    $answers = $data['answers'] ? : [];
    unset($data['answers']);

    $pollId = $I->haveInRepository(Poll::class, $data);
    $poll = $this->em->find(Poll::class, $pollId);

    foreach ($answers as $answer) {
      $this->createAnswer($I, $poll, [
        'answer' => $answer
      ]);
    }

    return $poll;
  }

  protected function createAnswer(ApiTester $I, Poll $poll, $data)
  {
    $data['poll'] = $poll;

    $answerId = $I->haveInRepository(Answer::class, $data);
    $answer = $this->em->find(Answer::class, $answerId);

    $poll->addAnswer($answer);
    $I->persistEntity($poll);

    return $answer;
  }

  public function _before(ApiTester $I)
  {
    $this->em = $I->getEntityManager();

    $this->createPoll($I, [
      'identifier'     => 'he7gis',
      'question'       => 'Test Question 1',
      'multipleChoice' => false,
      'deleted'        => false,
      'answers'        => [
        'Answer 1',
        'Answer 2'
      ]
    ]);
  }
}
