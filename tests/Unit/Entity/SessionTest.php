<?php

namespace ItsGoingToBeBundle\Tests\Unit\Entity;

use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseEntityTest;
use App\Entity\Session;

/**
 * Test for Session
 */
class SessionTest extends BaseEntityTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass = Session::class;

    public function testGetSetSessId()
    {
        $this->entity->setSessId('asdf234sdf3');
        self::assertEquals('asdf234sdf3', $this->entity->getSessId());
    }

    public function testGetSetSessData()
    {
        $this->entity->setSessData('Session data');
        self::assertEquals('Session data', $this->entity->getSessData());
    }

    public function testGetSetSessTime()
    {
        $this->entity->setSessTime('165441255');
        self::assertEquals('165441255', $this->entity->getSessTime());
    }

    public function testGetSetSessLifetime()
    {
        $this->entity->setSessLifetime('100');
        self::assertEquals('100', $this->entity->getSessLifetime());
    }
}
