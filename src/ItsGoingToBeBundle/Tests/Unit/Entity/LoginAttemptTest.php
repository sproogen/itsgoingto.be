<?php

namespace ItsGoingToBeBundle\Tests\Unit\Entity;

use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseEntityTest;
use App\Entity\LoginAttempt;

/**
 * Test for LoginAttempt
 */
class LoginAttemptTest extends BaseEntityTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass = LoginAttempt::class;

    public function testGetSetIp()
    {
        $this->entity->setIp('56.98.62.32');
        self::assertEquals('56.98.62.32', $this->entity->getIp());
    }

    public function testGetSetSuccesful()
    {
        $this->entity->setSuccesful(true);
        self::assertEquals(true, $this->entity->isSuccesful());
    }

    public function testGetSetUsername()
    {
        $this->entity->setUsername('user1');
        self::assertEquals('user1', $this->entity->getUsername());
    }

    public function testGetSetPassword()
    {
        $this->entity->setPassword('password');
        self::assertEquals('password', $this->entity->getPassword());
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

    public function testPrePersist()
    {
        self::assertEquals(null, $this->entity->getCreated());
        $now = new \DateTime();
        $this->entity->prePersist();
        self::assertInstanceOf(\DateTime::class, $this->entity->getCreated());
        self::assertEquals($now->format('Y-m-d H:i:s'), $this->entity->getCreated()->format('Y-m-d H:i:s'));
    }
}
