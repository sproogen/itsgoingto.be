<?php

namespace ItsGoingToBeBundle\Tests\Unit\Service;

use Prophecy\Argument;
use Prophecy\ObjectProphecy;
use Doctrine\ORM\EntityManager;
use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseTest;
use ItsGoingToBeBundle\Service\PollEndService;
use App\Entity\Poll;

/**
 * Tests for ItsGoingToBeBundle\Service\PollEndService
 */
class PollEndServiceTest extends BaseTest
{
    /**
     * Name of the class being tested.
     *
     * @var string
     */
    protected $serviceClass = PollEndService::class;

    /**
     * @var ObjectProphecy
     */
    protected $poll;

    public function setUp()
    {
        parent::setUp();

        $this->service = new $this->serviceClass();

        $this->entityManager = $this->prophesize(EntityManager::class);
        $this->entityManager->persist(Argument::any())
            ->willReturn(true);
        $this->entityManager->flush(Argument::any())
            ->willReturn(true);
        $this->service->setEntityManager($this->entityManager->reveal());

        $this->poll = $this->prophesize(Poll::class);
        $this->poll->isEnded()->willReturn(true);
        $this->poll->shouldHaveEnded()->willReturn(false);
        $this->poll->setEnded(true)->willReturn($this->poll->reveal());
    }

    /**
     * Test that UpdateIfEnded returns a Poll
     */
    public function testUpdateIfEndedReturnsPoll()
    {
        $poll = $this->service->updateIfEnded($this->poll->reveal());

        self::assertInstanceOf(Poll::class, $poll);
    }

    /**
     * Test that UpdateIfEnded doesn't update the poll if already ended
     */
    public function testUpdateIfEndedDoesntUpdateIfEnded()
    {
        $this->service->updateIfEnded($this->poll->reveal());

        $this->poll->isEnded()
             ->shouldHaveBeenCalledTimes(1);
        $this->poll->shouldHaveEnded()
             ->shouldHaveBeenCalledTimes(0);
        $this->poll->setEnded(true)
             ->shouldHaveBeenCalledTimes(0);
        $this->entityManager->persist(Argument::type(Poll::class))
             ->shouldHaveBeenCalledTimes(0);
        $this->entityManager->flush()
             ->shouldHaveBeenCalledTimes(0);
    }

    /**
     * Test that UpdateIfEnded doesn't update the poll if not ended date
     */
    public function testUpdateIfEndedDoesntUpdateIfNotEndedDate()
    {
        $this->poll->isEnded()->willReturn(false);

        $this->service->updateIfEnded($this->poll->reveal());

        $this->poll->isEnded()
             ->shouldHaveBeenCalledTimes(1);
        $this->poll->shouldHaveEnded()
             ->shouldHaveBeenCalledTimes(1);
        $this->poll->setEnded(true)
             ->shouldHaveBeenCalledTimes(0);
        $this->entityManager->persist(Argument::type(Poll::class))
             ->shouldHaveBeenCalledTimes(0);
        $this->entityManager->flush()
             ->shouldHaveBeenCalledTimes(0);
    }

    /**
     * Test that UpdateIfEnded updates the poll
     */
    public function testUpdateIfEndedUpdatesPoll()
    {
        $this->poll->isEnded()->willReturn(false);
        $this->poll->shouldHaveEnded()->willReturn(true);

        $this->service->updateIfEnded($this->poll->reveal());

        $this->poll->isEnded()
             ->shouldHaveBeenCalledTimes(1);
        $this->poll->shouldHaveEnded()
             ->shouldHaveBeenCalledTimes(1);
        $this->poll->setEnded(true)
             ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->persist(Argument::type(Poll::class))
             ->shouldHaveBeenCalledTimes(1);
        $this->entityManager->flush()
             ->shouldHaveBeenCalledTimes(1);
    }
}
