<?php

namespace ItsGoingToBeBundle\Tests\Entity;

use Doctrine\Common\Collections\Collection;
use ItsGoingToBeBundle\Tests\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\Question;
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
        $question = new Question();
        $this->entity->setQuestion($question);
        $response = new UserResponse();
        $this->entity->addResponse($response);

        $extractedData = $this->entity->extract();
        self::assertArrayHasKey('id', $extractedData);
        self::assertArrayHasKey('answer', $extractedData);
        self::assertArrayHasKey('question', $extractedData);
        self::assertArrayHasKey('responsesCount', $extractedData);

        self::assertEquals('Answer Text', $extractedData['answer']);
        $question = $extractedData['question'];
        self::assertArrayHasKey('type', $question);
        self::assertArrayHasKey('id', $question);
        self::assertEquals('question', $question['type']);
        self::assertEquals(1, $extractedData['responsesCount']);
    }

    public function testGetSetAnswer()
    {
        $this->entity->setAnswer('Answer Text');
        self::assertEquals('Answer Text', $this->entity->getAnswer());
    }

    public function testGetSetQuestion()
    {
        $question = new Question();
        $this->entity->setQuestion($question);
        self::assertEquals($question, $this->entity->getQuestion());
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
