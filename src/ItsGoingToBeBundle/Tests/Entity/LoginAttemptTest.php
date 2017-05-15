<?php

namespace ItsGoingToBeBundle\Tests\Entity;

use ItsGoingToBeBundle\Tests\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\LoginAttempt;

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
        self::assertEquals(true, $this->entity->getSuccesful());
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

    public function testGetSetCreatedAt()
    {
        $now = new \DateTime(date('Y-m-d H:i:s'));
        $this->entity->setCreatedAt($now);
        self::assertEquals($now, $this->entity->getCreatedAt());
    }

    public function testUpdateTimestamps()
    {
        self::assertEquals(null, $this->entity->getCreatedAt());
        $this->entity->updateTimestamps();
        self::assertInstanceOf(\DateTime::class, $this->entity->getCreatedAt());
    }
}