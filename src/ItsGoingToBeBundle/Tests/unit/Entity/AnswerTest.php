<?php

namespace ItsGoingToBeBundle\Tests\Unit\Entity;

use Doctrine\Common\Collections\Collection;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Test for Answer
 */
class AnswerTest extends BaseEntityTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass = Answer::class;

    public function testExtract()
    {
        $this->entity->setAnswer('Answer Text');
        $poll = new Poll();
        $this->entity->setPoll($poll);
        $response = new UserResponse();
        $this->entity->addResponse($response);

        $extractedData = $this->entity->extract();
        self::assertArrayHasKey('id', $extractedData);
        self::assertArrayHasKey('answer', $extractedData);
        self::assertArrayHasKey('poll', $extractedData);
        self::assertArrayHasKey('responsesCount', $extractedData);

        self::assertEquals('Answer Text', $extractedData['answer']);
        $poll = $extractedData['poll'];
        self::assertArrayHasKey('type', $poll);
        self::assertArrayHasKey('id', $poll);
        self::assertEquals('Poll', $poll['type']);
        self::assertEquals(1, $extractedData['responsesCount']);
    }

    public function testGetSetAnswer()
    {
        $this->entity->setAnswer('Answer Text');
        self::assertEquals('Answer Text', $this->entity->getAnswer());
    }

    public function testGetSetPoll()
    {
        $poll = new Poll();
        $this->entity->setPoll($poll);
        self::assertEquals($poll, $this->entity->getPoll());
    }

    public function testGetInitialResponses()
    {
        self::assertInstanceOf(Collection::class, $this->entity->getResponses());
        self::assertEquals(0, $this->entity->getResponses()->count());
    }

    public function testAddResponse()
    {
        $response = new UserResponse();
        $this->entity->addResponse($response);
        self::assertInstanceOf(Collection::class, $this->entity->getResponses());
        self::assertEquals(1, $this->entity->getResponses()->count());
        self::assertEquals($response, $this->entity->getResponses()->first());
    }

    public function testRemoveResponse()
    {
        $response1 = new UserResponse();
        $response2 = new UserResponse();
        $this->entity->addResponse($response1);
        $this->entity->addResponse($response2);
        self::assertInstanceOf(Collection::class, $this->entity->getResponses());
        self::assertEquals(2, $this->entity->getResponses()->count());
        self::assertEquals($response1, $this->entity->getResponses()->first());

        $this->entity->removeResponse($response1);
        self::assertEquals(1, $this->entity->getResponses()->count());
        self::assertEquals($response2, $this->entity->getResponses()->first());
    }
}
