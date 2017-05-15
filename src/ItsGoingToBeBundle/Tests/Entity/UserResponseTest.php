<?php

namespace ItsGoingToBeBundle\Tests\Entity;

use Doctrine\Common\Collections\Collection;
use ItsGoingToBeBundle\Tests\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Entity\Question;
use ItsGoingToBeBundle\Entity\Answer;

/**
 * Test for UserResponse
 */
class UserResponseTest extends BaseEntityTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass = UserResponse::class;

    public function testGetSetQuestion()
    {
        $question = new Question();
        $this->entity->setQuestion($question);
        self::assertEquals($question, $this->entity->getQuestion());
    }

    public function testGetSetAnswer()
    {
        $answer = new Answer();
        $this->entity->setAnswer($answer);
        self::assertEquals($answer, $this->entity->getAnswer());
    }

    public function testGetSetUserIp()
    {
        $this->entity->setUserIP('56.98.62.32');
        self::assertEquals('56.98.62.32', $this->entity->getUserIP());
    }

    public function testGetSetUserSessionID()
    {
        $this->entity->setUserSessionID('asdfsdf32r21fsf');
        self::assertEquals('asdfsdf32r21fsf', $this->entity->getUserSessionID());
    }

    public function testGetSetCustomUserID()
    {
        $this->entity->setCustomUserID('oihjnsd98jiksndf');
        self::assertEquals('oihjnsd98jiksndf', $this->entity->getCustomUserID());
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