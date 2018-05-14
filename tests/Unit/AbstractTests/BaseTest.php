<?php

namespace App\Tests\Unit\AbstractTests;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class BaseTest extends WebTestCase
{
    /**
     * The entity manager.
     *
     * @var EntityManager
     */
    protected $em;

    /**
     * A canonical \DateTime for this test.
     *
     * @var \DateTime
     */
    protected $now;

    /**
     * Test setup.
     */
    public function setUp()
    {
        self::bootKernel();

        $this->container = self::$kernel->getContainer();
        $this->em        = $this->container->get('doctrine')->getManager();
        $this->now       = new \DateTime();
    }

    /**
     * Test tear down.
     */
    protected function tearDown()
    {
        if ($this->em) {
            $this->em->getConnection()->close();
            $this->em->close();
            $this->em = null;
        }

        gc_collect_cycles();
    }
}
