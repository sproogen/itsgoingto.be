<?php

namespace ItsGoingToBeBundle\Tests\Unit\Entity;

use Doctrine\Common\Collections\Collection;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseEntityTest;
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
        $this->entity->setPassphrase('Passphrase');
        $this->entity->setEndDate($endDate = new \DateTime());
        $this->entity->setEnded(true);
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
        self::assertArrayHasKey('passphrase', $extractedData);
        self::assertArrayHasKey('endDate', $extractedData);
        self::assertArrayHasKey('ended', $extractedData);
        self::assertArrayHasKey('deleted', $extractedData);
        self::assertArrayHasKey('created', $extractedData);
        self::assertArrayHasKey('updated', $extractedData);

        self::assertEquals('sdf4er', $extractedData['identifier']);
        self::assertEquals('WHAT?', $extractedData['question']);
        $answers = $extractedData['answers'];
        self::assertCount(1, $answers);
        self::assertArrayHasKey('type', $answers[0]);
        self::assertArrayHasKey('id', $answers[0]);
        self::assertEquals('Answer', $answers[0]['type']);
        self::assertEquals(1, $extractedData['responsesCount']);
        self::assertEquals(true, $extractedData['multipleChoice']);
        self::assertEquals('Passphrase', $extractedData['passphrase']);
        self::assertEquals($endDate, $extractedData['endDate']);
        self::assertEquals(true, $extractedData['ended']);
        self::assertEquals(true, $extractedData['deleted']);
    }

    public function testShouldHaveEnded()
    {
        $now = new \DateTime();
        $now->modify('-1 hour');
        $this->entity->setEndDate($now);
        self::assertTrue($this->entity->shouldHaveEnded());

        $this->entity->setEndDate(null);
        self::assertFalse($this->entity->shouldHaveEnded());

        $now = new \DateTime();
        $now = $now->setTimezone(new \DateTimezone(timezone_name_from_abbr("", 2*3600, true)));
        $now->modify('-1 hour');
        $this->entity->setEndDate($now);
        self::assertTrue($this->entity->shouldHaveEnded());

        $now = new \DateTime();
        $now = $now->setTimezone(new \DateTimezone(timezone_name_from_abbr("", -2*3600, true)));
        $now->modify('+3 hour');
        $this->entity->setEndDate($now);
        self::assertFalse($this->entity->shouldHaveEnded());
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

    public function testGetSetPassphrase()
    {
        $this->entity->setPassphrase('Passphrase');
        self::assertEquals('Passphrase', $this->entity->getPassphrase());
    }

    public function testGetSetEndDate()
    {
        $now = new \DateTime();
        $this->entity->setEndDate($now);
        self::assertEquals($now, $this->entity->getEndDate());
        $now->modify('+1 day');
        $this->entity->setEndDate($now);
        self::assertEquals($now, $this->entity->getEndDate());
    }

    public function testGetSetEnded()
    {
        self::assertEquals(false, $this->entity->isEnded());
        $this->entity->setEnded(true);
        self::assertEquals(true, $this->entity->isEnded());
    }

    public function testGetSetDeleted()
    {
        self::assertEquals(false, $this->entity->isDeleted());
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
        $now = new \DateTime();
        $this->entity->prePersist();
        self::assertInstanceOf(\DateTime::class, $this->entity->getCreated());
        self::assertEquals($now, $this->entity->getCreated());
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdated());
        self::assertEquals($now, $this->entity->getUpdated());
    }

    public function testPreUpdate()
    {
        self::assertEquals(null, $this->entity->getUpdated());
        $now = new \DateTime();
        $this->entity->preUpdate();
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdated());
        self::assertEquals($now, $this->entity->getUpdated());
    }
}
