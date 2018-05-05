<?php

namespace ItsGoingToBeBundle\Tests\Unit\Entity;

use Doctrine\Common\Collections\Collection;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\UserResponse;
use ItsGoingToBeBundle\Entity\Poll;
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

    public function testGetSetPoll()
    {
        $poll = new Poll();
        $this->entity->setPoll($poll);
        self::assertEquals($poll, $this->entity->getPoll());
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

    public function testGetSetCreated()
    {
        $now = new \DateTime();
        $this->entity->setCreated();
        self::assertInstanceOf(\DateTime::class, $this->entity->getCreated());
        self::assertEquals($now->format('Y-m-d H:i:s'), $this->entity->getCreated()->format('Y-m-d H:i:s'));
        $now->modify('+1 day');
        $this->entity->setCreated($now);
        self::assertEquals($now, $this->entity->getCreated());
    }

    public function testGetSetUpdated()
    {
        $now = new \DateTime();
        $this->entity->setUpdated();
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdated());
        self::assertEquals($now->format('Y-m-d H:i:s'), $this->entity->getUpdated()->format('Y-m-d H:i:s'));
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
        self::assertEquals($now->format('Y-m-d H:i:s'), $this->entity->getCreated()->format('Y-m-d H:i:s'));
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdated());
        self::assertEquals($now->format('Y-m-d H:i:s'), $this->entity->getUpdated()->format('Y-m-d H:i:s'));
    }

    public function testPreUpdate()
    {
        self::assertEquals(null, $this->entity->getUpdated());
        $now = new \DateTime();
        $this->entity->preUpdate();
        self::assertInstanceOf(\DateTime::class, $this->entity->getUpdated());
        self::assertEquals($now->format('Y-m-d H:i:s'), $this->entity->getUpdated()->format('Y-m-d H:i:s'));
    }
}
