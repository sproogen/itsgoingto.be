<?php

namespace ItsGoingToBeBundle\Tests\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Event\LifecycleEventArgs;
use ItsGoingToBeBundle\Tests\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Test for Poll
 */
class PollTest extends BaseEntityTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass = Poll::class;

    public function testExtract()
    {
        $this->entity->setIdentifier('sdf4er');
        $this->entity->setQuestion('WHAT?');
        $answer = new Answer();
        $this->entity->addAnswer($answer);
        $response = new UserResponse();
        $this->entity->addResponse($response);
        $this->entity->setMultipleChoice(true);
        $this->entity->setDeleted(true);
        $this->entity->setCreated();
        $this->entity->setUpdated();

        $extractedData = $this->entity->extract();
        self::assertArrayHasKey('id', $extractedData);
        self::assertArrayHasKey('identifier', $extractedData);
        self::assertArrayHasKey('question', $extractedData);
        self::assertArrayHasKey('answers', $extractedData);
        self::assertArrayHasKey('responsesCount', $extractedData);
        self::assertArrayHasKey('multipleChoice', $extractedData);
        self::assertArrayHasKey('deleted', $extractedData);
        self::assertArrayHasKey('created', $extractedData);
        self::assertArrayHasKey('updated', $extractedData);

        self::assertEquals('sdf4er', $extractedData['identifier']);
        self::assertEquals('WHAT?', $extractedData['question']);
        $answers = $extractedData['answers'];
        self::assertCount(1, $answers);
        self::assertArrayHasKey('type', $answers[0]);
        self::assertArrayHasKey('id', $answers[0]);
        self::assertEquals('answer', $answers[0]['type']);
        self::assertEquals(1, $extractedData['responsesCount']);
        self::assertEquals(true, $extractedData['multipleChoice']);
        self::assertEquals(true, $extractedData['deleted']);
    }

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
        self::assertEquals(true, $this->entity->isMultipleChoice());
    }

    public function testGetSetDeleted()
    {
        $this->entity->setDeleted(true);
        self::assertEquals(true, $this->entity->isDeleted());
    }

    public function testGetSetCreated()
    {
        $now = new \DateTime();
        $this->entity->setCreated();
        self::assertEquals($now, $this->entity->getCreated());
        $now->modify('+1 day');
        $this->entity->setCreated($now);
        self::assertEquals($now, $this->entity->getCreated());
    }

    public function testGetSetUpdated()
    {
        $now = new \DateTime();
        $this->entity->setUpdated();
        self::assertEquals($now, $this->entity->getUpdated());
        $now->modify('+1 day');
        $this->entity->setUpdated($now);
        self::assertEquals($now, $this->entity->getUpdated());
    }

    public function testPrePersist()
    {
        self::assertEquals(null, $this->entity->getCreated());
        self::assertEquals(null, $this->entity->getUpdated());
        $lifecycleEventArgs = $this->prophesize(LifecycleEventArgs::class);
        $this->entity->prePersist($lifecycleEventArgs->reveal());
        self::assertInstanceOf(\DateTime::class, $this->entity->getCreated());
        self::assertEquals(new \DateTime(), $this->entity->getCreated());
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdated());
        self::assertEquals(new \DateTime(), $this->entity->getUpdated());
    }

    public function testPreUpdate()
    {
        self::assertEquals(null, $this->entity->getUpdated());
        $lifecycleEventArgs = $this->prophesize(LifecycleEventArgs::class);
        $this->entity->preUpdate($lifecycleEventArgs->reveal());
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdated());
        self::assertEquals(new \DateTime(), $this->entity->getUpdated());
    }
}
