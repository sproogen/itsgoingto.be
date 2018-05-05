<?php

namespace ItsGoingToBeBundle\Tests\Unit\Entity;

use Doctrine\Common\Collections\Collection;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseEntityTest;
use ItsGoingToBeBundle\Entity\User;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\Poll;
use ItsGoingToBeBundle\Entity\UserResponse;

/**
 * Test for User
 */
class UserTest extends BaseEntityTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass = User::class;

    public function testExtract()
    {
        $this->entity->setUsername('User');
        $this->entity->setCreated();
        $this->entity->setUpdated();

        $extractedData = $this->entity->extract();
        self::assertArrayHasKey('id', $extractedData);
        self::assertArrayHasKey('username', $extractedData);
        self::assertArrayHasKey('created', $extractedData);
        self::assertArrayHasKey('updated', $extractedData);

        self::assertEquals('User', $extractedData['username']);
    }

    public function testGetRoles()
    {
        self::assertEquals(['ROLE_USER', 'ROLE_ADMIN'], $this->entity->getRoles());
    }

    public function testGetSalt()
    {
        self::assertEquals(null, $this->entity->getSalt());
    }

    public function testGetSetUsername()
    {
        $this->entity->setUsername('User');
        self::assertEquals('User', $this->entity->getUsername());
    }

    public function testGetSetPassword()
    {
        $this->entity->setPassword('asdf32rsadfcvsd');
        self::assertEquals('asdf32rsadfcvsd', $this->entity->getPassword());
    }

    public function testGetSetPlainPassword()
    {
        $this->entity->setPlainPassword('password');
        self::assertEquals('password', $this->entity->getPlainPassword());
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
