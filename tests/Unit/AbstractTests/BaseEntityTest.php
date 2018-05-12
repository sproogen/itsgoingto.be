<?php

namespace ItsGoingToBeBundle\Tests\Unit\AbstractTests;

use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseTest;

abstract class BaseEntityTest extends BaseTest
{
    /**
     * The name of the Entity class being tested.
     *
     * @var string
     */
    protected $entityClass;

    /**
     * An instance of the Entity being tested.
     *
     * @var Entity
     */
    protected $entity;

    /**
     * Method called before each test is run.
     *
     * @throws \Exception if $this->entityClass is not set.
     */
    public function setUp()
    {
        parent::setUp();

        if (!$this->entityClass) {
            $message = 'Classes extending ' . BaseEntityTest::class . ' must declare a value for $entityClass.';
            throw new \Exception($message);
        }

        $this->entity = new $this->entityClass();
    }
}
