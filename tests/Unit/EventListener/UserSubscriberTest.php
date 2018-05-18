<?php

namespace App\Tests\Unit\Service;

use Prophecy\Argument;
use Prophecy\ObjectProphecy;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\UnitOfWork;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Mapping\ClassMetadata;
use App\Tests\Unit\AbstractTests\BaseTest;
use App\EventListener\UserSubscriber;
use App\Entity\User;
use App\Entity\Poll;

/**
 * Tests for App\EventListener\UserSubscriber
 */
class UserSubscriberTest extends BaseTest
{
    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $serviceClass = UserSubscriber::class;

    /**
     * @var ObjectProphecy
     */
    protected $encoder;

    /**
     * @var ObjectProphecy
     */
    protected $user;

    /**
     * @var ObjectProphecy
     */
    protected $unitOfWork;

    /**
     * @var ObjectProphecy
     */
    protected $entityManager;

    /**
     * @var ObjectProphecy
     */
    protected $args;

    public function setUp()
    {
        parent::setUp();

        $this->encoder = $this->prophesize(UserPasswordEncoderInterface::class);
        $this->encoder->encodePassword(Argument::any(), Argument::any())->willReturn('jas&dh37£23$*&qwd');

        $this->service = new $this->serviceClass($this->encoder->reveal());

        $this->user = $this->prophesize(User::class);
        $this->user->getPlainPassword()->willReturn('password');
        $this->user->setPassword(Argument::any())->willReturn($this->user->reveal());

        $this->unitOfWork = $this->prophesize(UnitOfWork::class);
        $this->unitOfWork->recomputeSingleEntityChangeSet(Argument::any(), Argument::any())->willReturn();

        $this->entityManager = $this->prophesize(EntityManager::class);
        $this->entityManager->getClassMetadata(Argument::any())->willReturn($this->prophesize(ClassMetadata::class));
        $this->entityManager->getUnitOfWork()->willReturn($this->unitOfWork->reveal());

        $this->args = $this->prophesize(LifecycleEventArgs::class);
        $this->args->getEntity()->willReturn($this->user->reveal());
        $this->args->getEntityManager()->willReturn($this->entityManager->reveal());
    }

    /**
     * Test that the listener subscribes to the correct events
     */
    public function testGetSubscribedEvents()
    {
        self::assertEquals(['prePersist', 'preUpdate'], $this->service->getSubscribedEvents());
    }

    /**
     * Test that prePersist encodes the plain password
     */
    public function testPrePersistEncodesPlainPassword()
    {
        $this->service->prePersist($this->args->reveal());

        $this->args->getEntity()
             ->shouldHaveBeenCalledTimes(1);
        $this->user->getPlainPassword()
             ->shouldHaveBeenCalledTimes(2);
        $this->encoder->encodePassword($this->user, 'password')
             ->shouldHaveBeenCalledTimes(1);
        $this->user->setPassword('jas&dh37£23$*&qwd')
             ->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that prePersist doesn't encodes the plain password if there isn't one
     */
    public function testPrePersistDoesntEncodesPlainPasswordIfNotExists()
    {
        $this->user->getPlainPassword()->willReturn();
        $this->service->prePersist($this->args->reveal());

        $this->args->getEntity()
             ->shouldHaveBeenCalledTimes(1);
        $this->user->getPlainPassword()
             ->shouldHaveBeenCalledTimes(1);
        $this->encoder->encodePassword($this->user, 'password')
             ->shouldHaveBeenCalledTimes(0);
        $this->user->setPassword('jas&dh37£23$*&qwd')
             ->shouldHaveBeenCalledTimes(0);
    }

    /**
     * Test that prePersist does nothing if the entity is not a User
     */
    public function testPrePersistDoesNothingIfNotUser()
    {
        $poll = $this->prophesize(Poll::class);
        $this->args->getEntity()->willReturn($poll->reveal());

        $this->service->prePersist($this->args->reveal());

        $this->args->getEntity()
             ->shouldHaveBeenCalledTimes(1);
        $this->user->getPlainPassword()
             ->shouldHaveBeenCalledTimes(0);
        $this->encoder->encodePassword($this->user, 'password')
             ->shouldHaveBeenCalledTimes(0);
        $this->user->setPassword('jas&dh37£23$*&qwd')
             ->shouldHaveBeenCalledTimes(0);
    }

    /**
     * Test that preUpdate encodes the plain password
     */
    public function testPreUpdateEncodesPlainPassword()
    {
        $this->service->preUpdate($this->args->reveal());

        $this->args->getEntity()
             ->shouldHaveBeenCalledTimes(1);
        $this->user->getPlainPassword()
             ->shouldHaveBeenCalledTimes(2);
        $this->encoder->encodePassword($this->user, 'password')
             ->shouldHaveBeenCalledTimes(1);
        $this->user->setPassword('jas&dh37£23$*&qwd')
             ->shouldHaveBeenCalledTimes(1);

        $this->args->getEntityManager()
             ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->getClassMetadata(Argument::type('string'))
             ->shouldHaveBeenCalledTimes(1);
        $this->unitOfWork->recomputeSingleEntityChangeSet(Argument::type(ClassMetadata::class), $this->user)
             ->shouldHaveBeenCalledTimes(1);
    }

    /**
     * Test that preUpdate doesn't encodes the plain password if there isn't one
     */
    public function testPreUpdateDoesntEncodesPlainPasswordIfNotExists()
    {
        $this->user->getPlainPassword()->willReturn();
        $this->service->preUpdate($this->args->reveal());

        $this->args->getEntity()
             ->shouldHaveBeenCalledTimes(1);
        $this->user->getPlainPassword()
             ->shouldHaveBeenCalledTimes(1);
        $this->encoder->encodePassword($this->user, 'password')
             ->shouldHaveBeenCalledTimes(0);
        $this->user->setPassword('jas&dh37£23$*&qwd')
             ->shouldHaveBeenCalledTimes(0);

        $this->unitOfWork->recomputeSingleEntityChangeSet(Argument::type(ClassMetadata::class), $this->user)
             ->shouldHaveBeenCalledTimes(0);
    }

    /**
     * Test that preUpdate does nothing if the entity is not a User
     */
    public function testPreUpdateDoesNothingIfNotUser()
    {
        $poll = $this->prophesize(Poll::class);
        $this->args->getEntity()->willReturn($poll->reveal());

        $this->service->preUpdate($this->args->reveal());

        $this->args->getEntity()
             ->shouldHaveBeenCalledTimes(1);
        $this->user->getPlainPassword()
             ->shouldHaveBeenCalledTimes(0);
        $this->encoder->encodePassword($this->user, 'password')
             ->shouldHaveBeenCalledTimes(0);
        $this->user->setPassword('jas&dh37£23$*&qwd')
             ->shouldHaveBeenCalledTimes(0);
    }
}
