<?php

namespace ItsGoingToBeBundle\Tests\Unit\AbstractTests;

use ItsGoingToBeBundle\Tests\Unit\AbstractTests\BaseTest;

/**
 * This class contains the common functionality for all Entity tests.
 *
 * It will test the setters and getters for all fields on the Entity.
 *
 * You must specifiy which Entity is being tested in $this->entityClass. You must also implement the 'getEntityData()'
 *   method which returns test data for this type of Entity.
 */
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
