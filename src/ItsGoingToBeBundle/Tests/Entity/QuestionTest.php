<?php

namespace ItsGoingToBeBundle\Tests\Entity;

use Doctrine\Common\Collections\Collection;
use ItsGoingToBeBundle\Tests\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Test for Question
 */
class QuestionTest extends BaseEntityTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass = Question::class;

    public function testGetSetIdentifier()
    {
        $this->entity->setIdentifier('sdf4er');
        self::assertEquals('sdf4er', $this->entity->getIdentifier());
    }

    public function testGetSetQuestion()
    {
        $this->entity->setQuestion('WHAT?');
        self::assertEquals('WHAT?', $this->entity->getQuestion());
    }

    public function testGetInitialAnswers()
    {
        self::assertInstanceOf(Collection::class, $this->entity->getAnswers());
        self::assertEquals(0, $this->entity->getAnswers()->count());
    }

    public function testAddAnswer()
    {
        $answer = new Answer();
        $this->entity->addAnswer($answer);
        self::assertInstanceOf(Collection::class, $this->entity->getAnswers());
        self::assertEquals(1, $this->entity->getAnswers()->count());
        self::assertEquals($answer, $this->entity->getAnswers()->first());
    }

    public function testRemoveAnswer()
    {
        $answer1 = new Answer();
        $answer2 = new Answer();
        $this->entity->addAnswer($answer1);
        $this->entity->addAnswer($answer2);
        self::assertInstanceOf(Collection::class, $this->entity->getAnswers());
        self::assertEquals(2, $this->entity->getAnswers()->count());
        self::assertEquals($answer1, $this->entity->getAnswers()->first());

        $this->entity->removeAnswer($answer1);
        self::assertEquals(1, $this->entity->getAnswers()->count());
        self::assertEquals($answer2, $this->entity->getAnswers()->first());
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

    public function testGetSetMultipleChoice()
    {
        $this->entity->setMultipleChoice(true);
        self::assertEquals(true, $this->entity->getMultipleChoice());
    }

    public function testGetSetDeleted()
    {
        $this->entity->setDeleted(true);
        self::assertEquals(true, $this->entity->getDeleted());
    }

    public function testGetSetCreatedAt()
    {
        $now = new \DateTime(date('Y-m-d H:i:s'));
        $this->entity->setCreatedAt($now);
        self::assertEquals($now, $this->entity->getCreatedAt());
    }

    public function testGetSetUpdatedAt()
    {
        $now = new \DateTime(date('Y-m-d H:i:s'));
        $this->entity->setUpdatedAt($now);
        self::assertEquals($now, $this->entity->getUpdatedAt());
    }

    public function testUpdateTimestamps()
    {
        self::assertEquals(null, $this->entity->getCreatedAt());
        self::assertEquals(null, $this->entity->getUpdatedAt());
        $this->entity->updateTimestamps();
        self::assertInstanceOf(\DateTime::class, $this->entity->getCreatedAt());
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdatedAt());

        $this->entity->setCreatedAt('SomeDate');
        $this->entity->setUpdatedAt('SomeDate');
        $this->entity->updateTimestamps();
        self::assertEquals('SomeDate', $this->entity->getCreatedAt());
        self::assertNotEquals('SomeDate', $this->entity->getUpdatedAt());
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdatedAt());
    }
}